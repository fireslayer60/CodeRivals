import React, { useState } from "react";
import styles from "./LoginStyles.module.css";
import bg from "../../assets/bg.png";
import { FcGoogle } from "react-icons/fc";
import { auth, provider, signInWithPopup } from "../../firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer, Slide } from "react-toastify";

import socket from "../../socket.js";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  // Implemented Google sign-in
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 🔹 Send Google user data to backend
      const response = await axios.post(
        `http://${import.meta.env.VITE_AWS_IP}:5000/api/google-login`,
        { email: user.email, password: user.password }
      );

      console.log("Google Login Success:", response.data);
      navigate("/home");
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      toast.error("❌ User not found. Try again.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
    }
  };

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle Login (Check from Database)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");

    try {
      const response = await axios.post(
        `http://${import.meta.env.VITE_AWS_IP}:5000/api/login`,
        userData
      );
      const curUser = localStorage.getItem("username");
      
      localStorage.setItem("username", response.data.user.username); 
      socket.emit("new_Login",{old_user: curUser,new_User:response.data.user.username});
      console.log(response.data.user.username);
      console.log("Login Success:", response.data);

      // Navigate if login is successful
      navigate("/home", { state: { successMessage: "Login Successful! 🎉" } });
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Fill out the empty details!";
      setErrors(errorMsg);

      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
    }
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.signUp}>
        <h1>Hey! There</h1>
        <p>Welcome to Code Rivals Community!</p>
        <button
          type="submit"
          className={styles.google}
          onClick={handleGoogleLogin}
        >
          <FcGoogle className={styles.gicon} />
          Login with Google
        </button>
        <div className={styles.breaker}>
          <div className={styles.line}></div>
          <p>or</p>
          <div className={styles.line}></div>
        </div>
        {errors.email && <span className={styles.error}>{errors.email}</span>}
        {errors.password && (
          <span className={styles.error}>{errors.password}</span>
        )}
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            
            name="email"
            placeholder=" Enter your User Name Or Email"
            value={userData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder=" Enter your password"
            value={userData.password}
            onChange={handleChange}
          />

          <p>Forgot password?</p>
          <button type="submit" className={styles.login}>
            Login
          </button>
        </form>
        <div className={styles.account}>
          <p>Don't have an account? </p>
          <p
            className={styles.accountsign}
            onClick={() => {
              navigate("/");
            }}
          >
            Sign Up!
          </p>
        </div>
      </div>

      <div className={styles.img}>
        <img src={bg} alt="Background" />
      </div>
    </div>
  );
}

export default Login;
