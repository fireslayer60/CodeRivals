import React, { useState, useEffect } from "react";
import styles from "./FriendStyles.module.css";
import { toast, ToastContainer } from "react-toastify";
import socket from "../../../socket.js";

function Friends() {
  const [searchUsername, setSearchUsername] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [message, setMessage] = useState("");
  const currentUsername = localStorage.getItem("username");

  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [incomingChallenge, setIncomingChallenge] = useState(null);

  // Fetch friend requests when page loads
  useEffect(() => {
    socket.on("challenge-response", ({ success, message }) => {
      if (success) toast.success(message);
      else toast.error(message);
    });

    // Listen for challenge status (accept/reject)
    socket.on("challenge-status", ({ success, message }) => {
      if (success) toast.success(message, { theme: "dark" });
      else toast.error(message, { theme: "dark" });
    });

    // Listen for match start
    socket.on("match-started", ({ roomName, players }) => {
      toast.success(
        `Match started with ${players.join(" & ")}! Room: ${roomName}`
      );
    });
    fetchFriendRequests();
    return () => {
      socket.off("challenge-response");
      socket.off("challenge-status");
      socket.off("match-started");
    };
  }, []);

  const sendMatchRequest = (friend_id) => {
    socket.emit("send_match_request", { toUsername: friend_id });
    console.log(socket.id + " " + friend_id);
  };

  const fetchFriendRequests = async () => {
    try {
      const currentUsername = localStorage.getItem("username");
      const response = await fetch(
        `http://${
          import.meta.env.VITE_AWS_IP
        }:5000/api/friends/requests/${currentUsername}`
      );
      const data = await response.json();
      console.log(data.friends);

      if (response.ok) {
        setFriendRequests(data.requests);
        setFriends(data.friends);
      } else {
        console.error("Error fetching friend requests:", data.error);
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const response = await fetch(
        `http://${import.meta.env.VITE_AWS_IP}:5000/api/friends/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user1_id: requestId,
            user2_id: currentUsername,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Friend request accept.");
        fetchFriendRequests(); // Refresh after rejecting
      } else {
        alert("Failed to reject request: " + data.error);
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await fetch(
        `http://${import.meta.env.VITE_AWS_IP}:5000/api/friends/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user1_id: requestId,
            user2_id: currentUsername,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Friend request rejected.");
        fetchFriendRequests(); // Refresh after rejecting
      } else {
        alert("Failed to reject request: " + data.error);
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchResult || !searchResult.username) {
      setMessage("No user selected to send request.");
      return;
    }
    try {
      const response = await fetch(
        `http://${
          import.meta.env.VITE_AWS_IP
        }:5000/api/friends/search-user?username=${searchUsername}`
      );
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
      const response = await fetch(
        `http://${
          import.meta.env.VITE_AWS_IP
        }:5000/api/friends/send-friend-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            toUsername: currentUsername,
            fromUsername: searchResult.username,
          }),
        }
      );

      let data;

      try {
        // Try to parse JSON
        data = await response.json();
      } catch (jsonError) {
        // Fallback if it's not valid JSON
        const text = await response.text();
        data = { error: text || "Unknown error occurred" };
      }

      if (response.ok) {
        setMessage("Friend request sent successfully! 🎉");
      } else {
        setMessage(data.error || "Failed to send request.");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      setMessage("Network error. Please try again later.");
    }
  };

  return (
    <>
      <div className={styles.card}>
        <h2>Find and Add Friends 🤝</h2>

        <input
          type="text"
          placeholder="Enter username..."
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          Search
        </button>

        {searchResult && (
          <div className={styles.resultCard}>
            <p>
              <strong>Username Found:</strong> {searchResult.username}{" "}
            </p>
            <button onClick={handleSendRequest} className={styles.addButton}>
              Send Friend Request
            </button>
          </div>
        )}

        {message && <p className={styles.message}>{message}</p>}
      </div>
      <div className={styles.card}>
        <h2>Friend Requests 📩</h2>

        {friendRequests.length > 0 ? (
          friendRequests.map((req) => (
            <div key={req.id} className={styles.requestCard}>
              <p>
                <strong>{req.user1_id}</strong> wants to be your friend!
              </p>
              <button
                onClick={() => handleAccept(req.user1_id)}
                className={styles.acceptButton}
              >
                Accept{" "}
              </button>
              <button
                onClick={() => handleReject(req.user1_id)}
                className={styles.rejectButton}
              >
                Reject{" "}
              </button>
            </div>
          ))
        ) : (
          <p>No incoming friend requests right now.</p>
        )}
      </div>
      <div className={styles.card}>
        <h2>Friends 👯‍♂️</h2>

        {friends.length > 0 ? (
          friends.map((req) => (
            <div key={req.id} className={styles.requestCard}>
              <p>
                <strong>{req.friend}</strong> is your your friend!
              </p>
              <button
                onClick={() => sendMatchRequest(req.friend)}
                className={styles.acceptButton}
              >
                Challenge{" "}
              </button>
              <button
                onClick={() => handleReject(req.friend)}
                className={styles.rejectButton}
              >
                Remove friend
              </button>
            </div>
          ))
        ) : (
          <p>No Friends :(</p>
        )}
      </div>
    </>
  );
}

export default Friends;
