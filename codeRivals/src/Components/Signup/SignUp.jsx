import React, { useState } from "react";
import styles from "./SignUpStyles.module.css";
import bg from "../../assets/bg.png";
import { FcGoogle } from "react-icons/fc";
import { auth, provider, signInWithPopup } from "../../firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import socket from "../../socket.js";

function SignUp() {
  const navigate = useNavigate();
  const [User, setUser] = useState(null);
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      console.log("User Info:", result.user);
      navigate("/home");
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
    }
  };

  const [UserData, SetUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, Seterrors] = useState({});

  const validate = () => {
    let newerror = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!UserData.email.trim()) {
      newerror.email = "Email is required";
    } else if (!emailRegex.test(UserData.email)) {
      newerror.email = "Email should be valid";
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!UserData.password.trim()) {
      newerror.password = "Password is required";
    } else if (!passwordRegex.test(UserData.password)) {
      newerror.password =
        "Password must be at least 8 characters long and contain both letters and numbers";
    }

    Seterrors(newerror);
    return Object.keys(newerror).length === 0;
  };

  const handleChange = (e) => {
    SetUserData({ ...UserData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await fetch(
          `http://${import.meta.env.VITE_AWS_IP}:5000/api/signup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(UserData),
          }
        );
        const data = await response.json();
        if (response.ok) {
          console.log("Signup successful", data);
          const curUser = localStorage.getItem("username");
          localStorage.setItem("username", UserData.username); 
          socket.emit("new_Login",{old_User: curUser,new_User:UserData.username});
          navigate("/home");
        } else {
          console.error("Signup failed", data);
          let dberror = {};
          dberror.email = data.error;
          Seterrors(dberror);
        }
      } catch (error) {
        console.error("Error during signup:", error);
      }
    }
  };

  const goLogin = () => {
    navigate("/Login");
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
          Signup with Google
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
        <form className={styles.form}>
          <input
            type="text"
            name="username"
            placeholder=" Enter your username"
            value={UserData.username}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder=" Enter your email"
            value={UserData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="  Enter your password"
            value={UserData.password}
            onChange={handleChange}
          />

          <p>Forgot password?</p>
          <button type="submit" className={styles.login} onClick={handleSubmit}>
            Signup
          </button>
        </form>
        <div className={styles.account}>
          <p>Already have an account? </p>
          <p className={styles.accountsign} onClick={goLogin}>
            Login!
          </p>
        </div>
      </div>

      <div className={styles.img}>
        <img src={bg} alt="Background" />
      </div>
    </div>
  );
}

export default SignUp;
