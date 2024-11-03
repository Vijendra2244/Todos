import React from "react";
import styles from "../css/Navbar.module.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className={styles.main}>
      <Link style={{ textDecoration: "none" }} to="/">
        <p>Dashboard</p>
      </Link>
      <Link style={{ textDecoration: "none" }} to="/login">
        <p>Login</p>
      </Link>
      <Link style={{ textDecoration: "none" }} to="/todos">
        <p>Own todos</p>
      </Link>
      <Link style={{ textDecoration: "none" }} to="/register">
        <p>Signup</p>
      </Link>
    </div>
  );
}

export default Navbar;
