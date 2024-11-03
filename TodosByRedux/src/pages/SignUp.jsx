import React, { useState } from "react";
import axios from "axios";
import styles from "../css/Navbar.module.css"; // Assuming you have some CSS styles
import { useNavigate } from "react-router-dom";
function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    age: "",
  });
  const nav = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success message

    try {
      const response = await axios.post(
        "https://todos-tz6o.onrender.com/users/register",
        formData,
        {
          withCredentials: true,
        }
      );
      setSuccess(response.data.msg); // Display success message
      setTimeout(() => {
        if (response.data.msg === "User registered successfully") {
          nav("/login");
        }
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.msg || "An error occurred during registration."
      );
    }
  };

  return (
    <div>
      <form className={styles.parent} onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="Enter your first name..."
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Enter your last name..."
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Enter your email..."
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password..."
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Enter your age..."
          value={formData.age}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>

      {/* Error and Success Messages */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}

export default SignUp;
