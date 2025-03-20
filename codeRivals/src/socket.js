import { io } from "socket.io-client";

const socket = io(`http://${import.meta.env.VITE_AWS_IP}:5000`); // Backend WebSocket URL

export default socket;