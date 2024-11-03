import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Home() {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://your-backend-url.com/todos/create", // Replace with your actual endpoint
        formData,
        { withCredentials: true } // Include this if using cookies for authentication
      );
      setMessage(response.data.msg);
      setFormData({ title: '', description: '' }); // Clear form
    } catch (error) {
      setMessage(error.response?.data?.msg || 'Error creating todo');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter title"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description"
          required
        ></textarea>
        <button type="submit">Create Todo</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Home;
