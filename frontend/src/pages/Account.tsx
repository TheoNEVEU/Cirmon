import { useState, useEffect } from 'react';
import Profile from '../components/profil';
import '../style/Account.css';

interface User {
  username: string;
  title: string;
  ppURL: string;
  badgeURL: string[]; 
  stats: number[];
  cards: number[];
}

function Account() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('https://testcirmon.onrender.com/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUser(data.user);
          } else {
            console.error('Erreur API :', data.message);
          }
        })
        .catch(err => console.error('Erreur réseau :', err));
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
          setUser(data.user);
        } else {
          alert(data.message);
        }
      });
  };

  const handleRegister = () => {
    const newUser: User = {
      username,
      title: 'Nouveau Joueur',
      ppURL: 'defaultPP',
      badgeURL: ['defaultBadge1', 'defaultBadge2'],
      stats: [0, 0, 0, 0, 0, 0],
      cards: []
    };

    fetch('https://testcirmon.onrender.com/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newUser, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
          setIsRegistering(false);
        } else {
          alert(data.error);
        }
      });
  };

  return (
    <div id="account-display" className="page-container">
      {user ? (
        <Profile username={user.username} isOwnProfile={true} />
      ) : (
        <>
          <h1 className="text-xl font-bold mb-2">{isRegistering ? 'Inscription' : 'Connexion'}</h1>
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
          {isRegistering ? (
            <button onClick={handleRegister} className="bg-green-500 text-white px-4 py-2 rounded">
              S'inscrire
            </button>
          ) : (
            <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
              Se connecter
            </button>
          )}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="mt-2 text-blue-700 underline"
          >
            {isRegistering ? 'Vous avez déjà un compte ? Se connecter' : "Pas encore de compte ? S'inscrire"}
          </button>
        </>
      )}
    </div>
  );
}

export default Account;
