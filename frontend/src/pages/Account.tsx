import { useEffect, useState } from 'react';
import '../style/Account.css';


type User = {
  username: string;
  email: string;
};

export default function Home() {
  const [user, setUser] = useState<User | null | false>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setUser(false);
      setLoading(false);
      return;
    }

    fetch('/api/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setUser(data);
      })
      .catch(() => {
        setUser(false);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div id="page-container">
      <div>Bienvenue sur ton compte</div><br></br><br></br>
      {loading ? (
        <p>Chargement...</p>
      ) : user ? (
        <p>Status : <span className="connected">connecté</span></p>
      ) : (
        <p>Status : <span className="disconnected">déconnecté</span></p>
      )}
    </div>
  );
}
