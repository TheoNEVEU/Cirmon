import { useState } from 'react';

import { useUser } from '../contexts/userContext';
import { useConnection } from '../contexts/connectedContext';
import { useApiSocket  } from '../contexts/ApiSocketContext';
import Profile from '../components/profil';

import '../style/Account.css';

export default function Account() {
  const { user, setUser } = useUser();
  const { status } = useConnection();
  const { baseUrl, socket } = useApiSocket();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = () => {
    fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem('token', data.token);
        // Aller chercher l'utilisateur après login :
        fetch(`${baseUrl}/users`, {
          headers: { 'Authorization': `Bearer ${data.token}` }
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUser(data.user);
          } else {
            console.error('Erreur API :', data.message);
          }
        });
      }
    });
  };

  const handleRegister = () => {
    const newUser = {
      username,
      password,
      title: {
        text: "",
        gradientDirection: "to right",
        colors: ["black"], 
        isGradientActive: false,
      },
      ppURL: 'defaultPP',
      badgeURL: ['defaultBadge1', 'defaultBadge2'],
      stats: [0, 0, 0, 0, 0, 0],
      cards: []
    };
    fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setIsRegistering(false);
        handleLogin();
      } 
      else {
        console.error('Erreur API (register):', data.message);
        handleLogin();
      }
    })
    .catch(err => {
      console.error('Erreur réseau (register):', err);
      alert('Erreur réseau: ' + err.message);
    });
  };
  
  if (!(status=="connected")) {
    return (
      <div id="page-container-loading">
        <img className="loadingImg"  src="img/loading.png" alt="car"/>
        <h2>Connexion à la base de données...</h2>
      </div>
    );
  }
  else {
    return (
      <>
        {user ? (
          <div id="account-display" className="page-container">
            <Profile username={user.username} isOwnProfile={true} />
          </div>
        ) : (
          <div id="connection-display" className="page-container" data-register={isRegistering}>
            <div id="connection-partA">
              <h1>Connexion</h1>
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border p-2 mb-2 block"
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleLogin}>
                  Se connecter
              </button>
              <button onClick={() => {setIsRegistering(false)}}>
                Pas encore de compte ? S'inscrire
              </button>
            </div>

            <div id="connection-partB">
              <h1>Inscription</h1>
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleRegister}>
                  S'inscrire
              </button>
              <button onClick={() => {setIsRegistering(true)}}>
                Déjà un compte ? Se connecter
              </button>
            </div> 
          </div>
        )}
      </>
    );
  }
};
