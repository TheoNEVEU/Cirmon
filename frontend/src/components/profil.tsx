import { useState, useEffect } from 'react';
import SmartImage from './smartImage';

interface User {
  username: string;
  ppURL: string;
}

interface ProfileProps {
  username: string;
  isOwnProfile?: boolean; // facultatif, si non précisé, on considère que c'est un profil public
}

function Profile({ username, isOwnProfile = false }: ProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);

  useEffect(() => {
    const url = isOwnProfile
      ? 'https://testcirmon.onrender.com/profile'
      : `https://testcirmon.onrender.com/profile/${username}`;

    const headers: HeadersInit = {};

    if (isOwnProfile) {
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    fetch(url, { headers })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user && typeof data.user.username === 'string') {
          setUser(data.user);
        } else {
          console.error('Erreur :', data.message);
        }
      })
      .catch(err => console.error('Erreur réseau :', err));
  }, [username, isOwnProfile]);

  if (!user) {
    return <p>Chargement du profil...</p>;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setSelectedUsername(null);
    
  };

  return (
    <div id="account-grid" className="page-container">
      <div id="profil-infos">
        <div id="profilpartA">
          <div id="pp-container"><SmartImage src={`${import.meta.env.BASE_URL}img/icones/plus.png`} alt="" fallbackSrc={`${import.meta.env.BASE_URL}img/icones/plus.png`}/></div>
          <div id="username"><h1>{user.username}</h1><h2>Creator</h2></div>
          <div id="badges-display">
            <div className="badge"><SmartImage src={`${import.meta.env.BASE_URL}img/profiles/${user.ppURL}.png`} alt="" fallbackSrc={`${import.meta.env.BASE_URL}img/icones/plus.png`}/></div>
            <div className="badge"><SmartImage src={`${import.meta.env.BASE_URL}img/profiles/${user.ppURL}.png`} alt="" fallbackSrc={`${import.meta.env.BASE_URL}img/icones/plus.png`}/></div>
          </div>
        </div>
          <div id="profilpartB">
            <div className='single-stat'>Nombre de cartes : 644</div>
            <div className='single-stat'>Nombre de cartes : 3637</div>
            <div className='single-stat'>Nombre de cartes : 3</div>
            <div className='single-stat'>Nombre de cartes : 596863</div>
            <div className='single-stat'>Nombre de cartes : 33</div>
            <div className='single-stat'>Nombre de cartes : 2357</div>
          </div>
        <div id="profilpartC">
          {isOwnProfile && (
            <>
              <button id="delete" className="account-button">
                <img src={`${import.meta.env.BASE_URL}img/icones/delete.png`} alt='' />Supprimer
              </button>
              <button className="account-button" onClick={() => handleLogout()}>
                <img src={`${import.meta.env.BASE_URL}img/icones/logout.png`} alt='' />Déconnexion
              </button>
              <button className="account-button">
                <img src={`${import.meta.env.BASE_URL}img/icones/edit.png`} alt='' />Modifier
              </button>
            </>
          )}
          {!isOwnProfile && (
              <>
              </>
          )}
        </div>

      </div> 
      <div id="profil-cards"> 

      </div>
    </div>
  );
}

export default Profile;