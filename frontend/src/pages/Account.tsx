import React, { useState, useEffect } from 'react';

import '../style/Account.css';

interface User {
  username: string;
}

function Account() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('https://testcirmon.onrender.com/profile', {
        headers: { 'Authorization': token }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setUser(data.user);
        });
    }
  }, []);

  const handleLogin = () => {
    fetch('https://testcirmon.onrender.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('token', data.token);
          setUser({ username: data.username });
        } else {
          alert(data.message);
        }
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="p-4">
      {user ? (
        <>
          <h1 className="text-xl font-bold mb-2">Bienvenue {user.username} !</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
            Déconnexion
          </button>
        </>
      ) : (
        <>
          <h1 className="text-xl font-bold mb-2">Connexion</h1>
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
            className="border p-2 mb-2 block"
          />
          <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
            Se connecter
          </button>
        </>
      )}
    </div>
  );
}

export default Account;
