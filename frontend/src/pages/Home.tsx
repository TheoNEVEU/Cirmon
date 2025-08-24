import { useEffect, useState } from 'react';
import { useConnection } from '../contexts/connectedContext'
import { useUser } from '../contexts/userContext';
import { usePage } from '../contexts/pageContext';
import { useApiSocket } from "../contexts/ApiSocketContext";

import ProfileDisplay from '../components/profileDisplay'

import '../style/Home.css'

export default function Home() {
  const { user } = useUser();
  const { status } = useConnection();
  const { setActivePage } = usePage();
  const { socket } = useApiSocket();
  
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if(!socket) return;

    // Écoute des messages du serveur
    socket.on("receiveMessage", (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const sendMessage = () => {
    if(!socket) return;
    if (message.trim()) {
      socket.emit("sendMessage", "["+user?.username+"] "+ message); // Envoi au serveur
      setMessage("");
    }
  };

  if (!(status=='connected')) {
    return (
      <div id="page-container-loading">
        <img className="loadingImg"  src="img/loading.png" alt="car"/>
        <h2>Connexion à la base de données...</h2>
      </div>
    );
  }
  else {
    return (
      <div id="home-page-container"><ProfileDisplay/>
        {!user? null :
          <div id='currency-display'><img src={`${import.meta.env.BASE_URL}img/currency.png`}></img>{user?.diamonds}</div>
        }
        <div id="message-display">
          <h1>Chat test Socket.io</h1>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tape ton message"
      />
      <button onClick={sendMessage}>Envoyer</button>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
        </div>
        <div id="booster-cover" className='placeholder'> </div>
        <button className="green-btn" style={user && user.diamonds >= 200 ? undefined : {filter: "grayscale(1)"}} onClick={() => {user && user.diamonds >= 200 ? setActivePage('boosters') : null}}>Ouvrir 1</button>
      </div>
    );
  }
}
