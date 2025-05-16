import { io } from "socket.io-client";

const username = localStorage.getItem("username"); // or wherever you store it

const socket = io(`http://${import.meta.env.VITE_AWS_IP}:5000`, {
  query: { username }
});

export default socket;
