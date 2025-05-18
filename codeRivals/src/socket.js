import { io } from "socket.io-client";

let username = localStorage.getItem("username"); // or wherever you store it
if (!username) {
  username = `guest_${Math.random().toString(36).substring(2, 10)}`; 
  localStorage.setItem("username", username); 
}
console.log(username);
const socket = io(`http://${import.meta.env.VITE_AWS_IP}:5000`, {
  query: { username }
});

export default socket;
