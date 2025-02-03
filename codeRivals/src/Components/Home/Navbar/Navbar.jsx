import React from "react";
import { Link } from "react-router-dom";
import styles from "./NavbarStyles.module.css"; 
import pfpic from "../../../assets/meme.jpg";
import logo from "../../../assets/C.png";

function Navbar() {
   
  
    return (
      <nav className={styles.navbar}>
        <div className={styles.navbarContainer}>
        <div className={styles.profileContainer}>
            {/* Profile Avatar */}
            <img
              src={logo}
              alt="Profile Avatar"
              className={styles.profileAvatar}
            />
          </div>
          <ul className={styles.navbarLinks}>
            <li>
              <Link to="/" className={styles.navbarLink}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/challenge" className={styles.navbarLink}>
                Challenge a Friend
              </Link>
            </li>
            <li>
              <Link to="/leaderboards" className={styles.navbarLink}>
                Leaderboards
              </Link>
            </li>
          </ul>
  
          <div className={styles.profileContainer}>
            {/* Profile Avatar */}
            <img
              src={pfpic}
              alt="Profile Avatar"
              className={styles.profileAvatar}
            />
          </div>
        </div>
      </nav>
    );
  }
  
  export default Navbar;