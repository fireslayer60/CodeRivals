import React, { useState } from "react";
import styles from "./ProfileStyles.module.css";
import pfp from "../../assets/defpfp.png";

const Profile = () => {
  const [profileImage, setProfileImage] = useState(pfp);

  // State for edit mode
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // State for personal info
  const [personalInfo, setPersonalInfo] = useState({
    username: "bruvman",
    firstName: "Rafiquar",
    lastName: "Rahman",
    email: "rafiqurrahman51@gmail.com",
    phone: "+09 345 346 46",
    bio: "Team Manager",
  });

  // State for address
  const [address, setAddress] = useState({
    country: "United Kingdom",
  });

  // Handle image change
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
        if (file.size <= 2 * 1024 * 1024) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        } else {
            alert("File size must be 2MB or less.");
        }
    }
};


  // Handle personal info change
  const handlePersonalChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  // Handle address change
  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <ul>
          <li>My Profile</li>
          <li style={{ color: "red" }}>Delete Account</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={styles.main}>
        {/* Profile Header */}
        <div className={styles.card}>
          <div className={styles.profileHeader}>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="fileInput"
              onChange={handleImageChange}
            />
            <img
              src={profileImage}
              alt="Profile"
              className={styles.profilePic}
              onClick={() => document.getElementById("fileInput").click()}
            />
            <div>
              <h3>{personalInfo.username}</h3>
              <p>{personalInfo.bio}</p>
              <p>{address.country}</p>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className={styles.card}>
          <div className={styles.cardleft}>
            <h4>Personal Information</h4>
            {isEditingPersonal ? (
              <>
                <input
                  type="text"
                  name="username"
                  value={personalInfo.username}
                  onChange={handlePersonalChange}
                />
                <input
                  type="text"
                  name="firstName"
                  value={personalInfo.firstName}
                  onChange={handlePersonalChange}
                />
                <input
                  type="text"
                  name="lastName"
                  value={personalInfo.lastName}
                  onChange={handlePersonalChange}
                />
                <input
                  type="email"
                  name="email"
                  value={personalInfo.email}
                  onChange={handlePersonalChange}
                />
                <input
                  type="text"
                  name="phone"
                  value={personalInfo.phone}
                  onChange={handlePersonalChange}
                />
                <input
                  type="text"
                  name="bio"
                  value={personalInfo.bio}
                  onChange={handlePersonalChange}
                />
                <button className={styles.saveButton} onClick={() => setIsEditingPersonal(false)}>Save</button>
                <button className={styles.cancelButton} onClick={() => setIsEditingPersonal(false)}>Cancel</button>
              </>
            ) : (
              <>
                <p><strong>Username:</strong> {personalInfo.username}</p>
                <p><strong>First Name:</strong> {personalInfo.firstName}</p>
                <p><strong>Last Name:</strong> {personalInfo.lastName}</p>
                <p><strong>Email:</strong> {personalInfo.email}</p>
                <p><strong>Phone:</strong> {personalInfo.phone}</p>
                <p><strong>Bio:</strong> {personalInfo.bio}</p>
                <button className={styles.editButton} onClick={() => setIsEditingPersonal(true)}>Edit ✏️</button>
              </>
            )}
          </div>
        </div>

        {/* Address */}
        <div className={styles.card}>
          <div className={styles.cardleft}>
            <h4>Address</h4>
            {isEditingAddress ? (
              <>
                <input
                  type="text"
                  name="country"
                  value={address.country}
                  onChange={handleAddressChange}
                />
                <button className={styles.saveButton} onClick={() => setIsEditingAddress(false)}>Save</button>
                <button className={styles.cancelButton} onClick={() => setIsEditingAddress(false)}>Cancel</button>
              </>
            ) : (
              <>
                <p><strong>Country:</strong> {address.country}</p>
                <button className={styles.editButton} onClick={() => setIsEditingAddress(true)}>Edit ✏️</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
