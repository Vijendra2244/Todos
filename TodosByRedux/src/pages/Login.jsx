import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/Navbar.module.css";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
        "https://todos-tz6o.onrender.com/users/login",
        formData,
        {
          withCredentials: true,
        }
      );
      setSuccess(response.data.msg); // Display success message
      setTimeout(() => {
        if (response.data.msg === "User logged in successfully") {
          nav("/");
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

        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}

export default Login;
