import { useState, useEffect } from 'react';
import Profile from '../components/profil';
import '../style/Account.css';

interface User {
  username: string;
}

function Account() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

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
          setUser({ username: data.username });
        } else {
          alert(data.message);
        }
      });
  };

  const handleRegister = () => {
    fetch('https://testcirmon.onrender.com/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
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
      {selectedUsername ? (
        // Affiche le profil sélectionné
        <div>
          <Profile username={selectedUsername} isOwnProfile={user?.username === selectedUsername} />
          <button onClick={() => setSelectedUsername(null)} className="mt-4 text-blue-700 underline">Retour</button>
        </div>
      ) : user ? (
        // Affiche les options pour ton propre compte
        <>
          <Profile username={user.username} isOwnProfile={true} />
        </>
      ) : (
        // Formulaire de connexion/inscription
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
