import { useState, useEffect } from 'react';
import SmartImage from './smartImage';

interface User {
  username: string;
  title: string;
  ppURL: string;
  badgeURL: string[];
  stats: number[];
  cards: number[];
}

interface ProfileProps {
  username: string;
  isOwnProfile?: boolean;
}

function Profile({ username, isOwnProfile = false }: ProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const statlist = ["Nombre de cartes", "Nombre de boosters ouvert", "Nombre de cartes uniques", "4", "Nombre de cartes FA", "6"]

  useEffect(() => {
    const url = isOwnProfile
      ? 'https://testcirmon.onrender.com/users'
      : `https://testcirmon.onrender.com/users/${username}`;

    const headers: HeadersInit = {};
    if (isOwnProfile) {
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    fetch(url, { headers })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          console.error('Erreur :', data.message);
        }
      })
      .catch(err => console.error('Erreur réseau :', err));
  }, [username, isOwnProfile]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const handleDelete = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found');
      return;
    }
    const response = await fetch('https://ton-backend.com/api/users/delete', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      localStorage.removeItem('token');
      window.location.reload();
    } else {
      console.error('Failed to delete account');
    }
  } catch (error) {
    console.error('Error deleting account:', error);
  }
};


  if (!user) return <p>Chargement du profil...</p>;

  return (
    <div id="account-grid" className="page-container">
      <div id="profil-infos">
        <div id="profilpartA">
          <div id="pp-container">
            <SmartImage src={`${import.meta.env.BASE_URL}img/profiles/${user.ppURL}.png`} alt="" fallbackSrc={`${import.meta.env.BASE_URL}img/icones/plus.png`} />
          </div>
          <div id="username">
            <h1>{user.username}</h1>
            <h2>{user.title}</h2>
          </div>
          <div id="badges-display">
            {user.badgeURL.map((badge, index) => (
              <div key={index} className="badge">
                <SmartImage src={`${import.meta.env.BASE_URL}img/badges/${badge}.png`} alt="" fallbackSrc={`${import.meta.env.BASE_URL}img/icones/plus.png`} />
              </div>
            ))}
          </div>
        </div>

        <div id="profilpartB">
          {user.stats.map((stat, index) => (
            <div key={index} className='single-stat'> {statlist[index]} : {stat}</div>
          ))}
        </div>

        <div id="profilpartC">
          {isOwnProfile && (
            <>
              <button id="delete" className="account-button" onClick={handleDelete}>
                <img src={`${import.meta.env.BASE_URL}img/icones/delete.png`} alt='' /> Supprimer
              </button>
              <button className="account-button" onClick={handleLogout}>
                <img src={`${import.meta.env.BASE_URL}img/icones/logout.png`} alt='' /> Déconnexion
              </button>
              <button className="account-button">
                <img src={`${import.meta.env.BASE_URL}img/icones/edit.png`} alt='' /> Modifier
              </button>
            </>
          )}
        </div>
      </div>

      <div id="profil-cards">
        {/* Ici tu pourras afficher les cartes de l'utilisateur si besoin */}
      </div>
    </div>
  );
}

export default Profile;
