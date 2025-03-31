import React, { useState, useEffect } from "react";
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
    country: "",
  });

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://${import.meta.env.VITE_AWS_IP}:5000/api/profile/${
            personalInfo.email
          }`
        );
        const data = await response.json();

        if (response.ok) {
          setPersonalInfo({
            username: data.username,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            phone: data.phone,
            bio: data.bio,
          });

          setAddress({
            country: data.country,
          });
        } else {
          console.error("Error fetching profile data:", data.error);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchUserData();
  }, []);

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

  // Save updated personal info
  const handleSavePersonalInfo = async () => {
    try {
      const response = await fetch(
        `http://${import.meta.env.VITE_AWS_IP}:5000/api/profile/${
          personalInfo.email
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: personalInfo.username,
            firstName: personalInfo.firstName,
            lastName: personalInfo.lastName,
            phone: personalInfo.phone,
            bio: personalInfo.bio,
            country: address.country,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      alert("Profile updated successfully!");
      setIsEditingPersonal(false); // ✅ Exit edit mode after success
    } catch (error) {
      alert(error.message); // ✅ Show error alert
    }
  };

  // Save updated address
  const handleSaveAddress = async () => {
    try {
      const response = await fetch(
        `http://${import.meta.env.VITE_AWS_IP}:5000/api/profile/${
          personalInfo.email
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...personalInfo,
            country: address.country,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Address updated successfully!");
        setIsEditingAddress(false);
      } else {
        alert("Failed to update address: " + data.error);
      }
    } catch (error) {
      console.error("Error updating address:", error);
    }
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
                  disabled
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
                <button
                  className={styles.saveButton}
                  onClick={handleSavePersonalInfo}
                >
                  Save
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={() => setIsEditingPersonal(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p>
                  <strong>Username:</strong> {personalInfo.username}
                </p>
                <p>
                  <strong>First Name:</strong> {personalInfo.firstName}
                </p>
                <p>
                  <strong>Last Name:</strong> {personalInfo.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {personalInfo.email}
                </p>
                <p>
                  <strong>Phone:</strong> {personalInfo.phone}
                </p>
                <p>
                  <strong>Bio:</strong> {personalInfo.bio}
                </p>
                <button
                  className={styles.editButton}
                  onClick={() => setIsEditingPersonal(true)}
                >
                  Edit ✏️
                </button>
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
                <button
                  className={styles.saveButton}
                  onClick={handleSaveAddress}
                >
                  Save
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={() => setIsEditingAddress(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p>
                  <strong>Country:</strong> {address.country}
                </p>
                <button
                  className={styles.editButton}
                  onClick={() => setIsEditingAddress(true)}
                >
                  Edit ✏️
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
