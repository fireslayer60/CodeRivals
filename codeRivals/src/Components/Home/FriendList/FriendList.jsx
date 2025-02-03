import React from "react";
import styles from "./FriendList.module.css";
import pfp from "../../../assets/meme.jpg"; // Import profile picture

// Placeholder friends list data
const friendsData = [
  { name: "Friend 1", profilePic: "../../../assets/meme.jpg", status: "Online" },
  { name: "Friend 2", profilePic: "../../../assets/meme.jpg", status: "Online" },
  { name: "Friend 3", profilePic: "../../../assets/meme.jpg", status: "Offline" },
  { name: "Friend 4", profilePic: "../../../assets/meme.jpg", status: "Offline" },
];

function FriendsList() {
  return (
    <div className={styles.friendsListContainer}>
      <h2 className={styles.friendsListTitle}>Friends</h2>
      <div className={styles.friendsList}>
        {friendsData.map((friend, index) => (
          <div key={index} className={styles.friendItem}>
            <img
              src={pfp}
              alt={friend.name}
              className={styles.friendImage}
            />
            <span className={styles.friendName}>{friend.name}</span>
            <span
              className={`${styles.status} ${
                friend.status === "Online" ? styles.online : styles.offline
              }`}
            >
              {friend.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FriendsList;
