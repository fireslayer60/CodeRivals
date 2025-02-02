import React,{useEffect,useState} from 'react';
import socket from '../../socket.js'; 

function Home() {
    const [statust, setStatus] = useState('Click "Find Match" to start');
    
        

        useEffect(() => {
            
            socket.on('match_found', ({ room, player1, player2 }) => {
              
              setStatus(`Matched! Room: ${room} | ${player1} vs ${player2} i am ${socket.id}`);
            });
        
        
            return () => {
              socket.off('match_found');
            };
          }, []);
    
    const findMatch = () => {
        setStatus('Searching for a match...');
        
        socket.emit('join_queue');
      };
  return (
    <div>
    <h1>Matchmaking</h1>
    <p>{statust}</p>  
    <button onClick={findMatch}>Find Match</button>  
  </div>
  )
}

export default Home
