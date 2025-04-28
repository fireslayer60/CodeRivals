import React, { useState } from 'react';
import styles from "./FriendStyles.module.css";

function Friends() {
  const [searchUsername, setSearchUsername] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [message, setMessage] = useState("");
  const currentUsername = localStorage.getItem("username");

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://${import.meta.env.VITE_AWS_IP}:5000/api/friends/search-user?username=${searchUsername}`);
      const data = await response.json();
      console.log(data[0]);

      if (response.ok) {
        setSearchResult(data[0]);
        setMessage("");
      } else {
        setSearchResult(null);
        setMessage("User not found.");
      }
    } catch (error) {
      console.error("Error searching user:", error);
      setMessage("Error searching user.");
    }
  };

  const handleSendRequest = async () => {
    try {
      const response = await fetch(`http://${import.meta.env.VITE_AWS_IP}:5000/api/friends/send-friend-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toUsername: searchResult.username, 
          fromUsername: currentUsername, 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Friend request sent successfully! 🎉");
      } else {
        setMessage(data.error || "Failed to send request.");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      setMessage("Error sending friend request.");
    }
  };

  return (
    <div className={styles.card}>
      <h2>Find and Add Friends 🤝</h2>

      <input
        type="text"
        placeholder="Enter username..."
        value={searchUsername}
        onChange={(e) => setSearchUsername(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleSearch} className={styles.searchButton}>Search</button>

      {searchResult && (
        <div className={styles.resultCard}>
          <p><strong>Username Found:</strong> {searchResult.username} {currentUsername}</p>
          <button onClick={handleSendRequest} className={styles.addButton}>Send Friend Request</button>
        </div>
      )}

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}

export default Friends;

