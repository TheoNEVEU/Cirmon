import { useEffect, useState } from 'react';
import { useConnection } from '../contexts/connectedContext'
import { useUser } from '../contexts/userContext';
import { usePage } from '../contexts/pageContext';
import { useApiSocket } from "../contexts/ApiSocketContext";

import ProfileDisplay from '../components/profileDisplay'

import '../style/Home.css'

interface Message {
  type: String,
  content: String,
  createdAt: Date,
  expiresAt: Date
};

export default function Home() {
  const { user } = useUser();
  const { status } = useConnection();
  const { setActivePage } = usePage();
  const { socket } = useApiSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatOpened, setIsChatOpened] = useState<boolean>(false);

  useEffect(() => {
    if(!socket) return;

    // Écoute des messages du serveur
    socket.on("newAlert", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

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
        <div id="message-display" data-open={isChatOpened ? true : false}>
          <button id='message-display-opener' onClick={() => setIsChatOpened(!isChatOpened)}><div data-open={isChatOpened ? true : false}></div></button>
          <div>
            {messages.map((m, i) => (
              <div key={i} className='single-message'>
                <p className='single-message-time'>{"> "+ new Date(m.createdAt).toLocaleTimeString('fr-FR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                <p className='single-message-content' dangerouslySetInnerHTML={{ __html: m.content }}></p>
              </div>
            ))}
          </div>
          {/* <div>
            <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ton message"/>
            <button onClick={sendMessage}>Envoyer</button>
          </div> */}
        </div>
        <div id="booster-cover" className='placeholder'> </div>
        <button className="green-btn" style={user && user.diamonds >= 200 ? undefined : {filter: "grayscale(1)"}} onClick={() => {user && user.diamonds >= 200 ? setActivePage('boosters') : null}}>Ouvrir 1</button>
      </div>
    );
  }
}
