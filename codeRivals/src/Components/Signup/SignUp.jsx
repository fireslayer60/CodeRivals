import React from 'react';
import styles from "./SignUpStyles.module.css";
import bg from "../../assets/bg.png";
import { FcGoogle } from "react-icons/fc";

function SignUp() {
  return (
    <div className={styles.container}>
     
      <div className={styles.signUp}>
        <h1>Hey! There</h1>
        <p>Welcome to Code Rivals Community!</p>
        <button type="submit" className={styles.google}><FcGoogle className={styles.gicon}/>Login with Google</button>
        <div className={styles.breaker}>
                <div className={styles.line}></div>
                <p>or</p>
                <div className={styles.line}></div>
        </div>
        <form className={styles.form}>
        
          <input type="text" placeholder="   Enter your name" />
          <input type="email" placeholder="  Enter your email" />
          <p>Forgot password?</p>
          <button type="submit" className={styles.login}>Login</button>
        </form>
        <div className={styles.account}>
        <p>Don't have an account? </p>
        <p className={styles.accountsign}>Sign Up!</p>
      </div>
      </div>
      

      
      <div className={styles.img}>
        <img src={bg} alt="Background" />
      </div>
      
    </div>
  );
}

export default SignUp;
