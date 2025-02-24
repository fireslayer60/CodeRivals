import React,{useState} from 'react';
import styles from "./LoginStyles.module.css";
import bg from "../../assets/bg.png";
import { FcGoogle } from "react-icons/fc";
import { auth, provider, signInWithPopup } from '../../firebaseConfig.js';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); 

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
  const [UserData,SetUserData] = useState({
    user:"",
    password:""
  });

  const [errors,Seterrors] =useState({});

  const validate = ()=>{
    let newerror = {};
    

    Seterrors(newerror);
    return Object.keys(newerror).length === 0;
  };

  const handleChange = (e)=>{
    SetUserData({...UserData,[e.target.name]:e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted", UserData);
    }
  };
  const goSign = () =>{
    navigate("/");
  };

  return (
    <div className={styles.container}>
     
      <div className={styles.signUp}>
        <h1>Hey! There</h1>
        <p>Welcome to Code Rivals Community!</p>
        <button type="submit" className={styles.google} onClick={handleGoogleLogin}><FcGoogle className={styles.gicon}/>Login with Google</button>
        <div className={styles.breaker}>
                <div className={styles.line}></div>
                <p>or</p>
                <div className={styles.line}></div>
        </div>
        {errors.email && <span className={styles.error}>{errors.email}</span>}
        {errors.password && <span className={styles.error}>{errors.password}</span>}
        <form className={styles.form}>
        
        <input 
            type="email" 
            name="email" 
            placeholder=" Enter your User Name Or Email" 
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
          <button type="submit" className={styles.login} onClick={handleSubmit}>Login</button>
        </form>
        <div className={styles.account}>
        <p>Already have an account? </p>
        <p className={styles.accountsign} onClick={goSign}>Sign Up!</p>
      </div>
      </div>
      

      
      <div className={styles.img}>
        <img src={bg} alt="Background" />
      </div>
      
    </div>
  );
}

export default Login;
