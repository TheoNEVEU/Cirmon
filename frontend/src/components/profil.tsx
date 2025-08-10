import { useState, useEffect } from 'react';
import SmartImage from './smartImage';

interface User {
  username: string;
  title: TitleWithEffect;
  ppURL: string;
  badgeURL: string[];
  stats: number[];
  cards: number[];
}

interface TitleWithEffect {
  text: string;
  gradientDirection: string;
  colors: string[];
  isGradientActive: boolean;
}

interface ProfileProps {
  username: string;
  isOwnProfile?: boolean;
}

function Profile({ username, isOwnProfile = false }: ProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
    const response = await fetch('https://testcirmon.onrender.com/users', {
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
      console.error('Erreur lors de la suppression du compte');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
  }
  
};

  if (!user) return <p>Chargement du profil...</p>;
  else { 
    var colors = user?.title?.colors ?? ['green'];
    var direction = user?.title?.gradientDirection ?? 'to left';

    const gradientStyle = {
      background: `linear-gradient(${direction}, ${colors.join(', ')})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      color: 'transparent',
      width: 'fit-content',
      paddingLeft: '3%',
      fontSize: '100%'
    };

  return (
    <div id="account-grid" className="page-container">
      <div id="profil-infos" data-isediting={isEditing}>
        <div id="profilpartA">
          <div id="pp-container">
            <SmartImage src={`${import.meta.env.BASE_URL}img/profiles/${user.ppURL}.png`} alt="" fallbackSrc={`${import.meta.env.BASE_URL}img/icones/plus.png`} />
          </div>
          <div id="username">
            <h1>{user.username}</h1>
            <h2 style={user.title.isGradientActive ? gradientStyle : {}}>
              {user.title.text ?? "test"}
            </h2>
          </div>
          <div id="badges-display">
            {user.badgeURL.map((badge, index) => (
              <div key={index} className="badge">
                <SmartImage src={`${import.meta.env.BASE_URL}img/badges/${badge}.png`} alt="" fallbackSrc={`${import.meta.env.BASE_URL}img/icones/plus.png`} />
              </div>
            ))}
          </div>
        </div>

        <div id="profilpartB" data-isediting={isEditing} style={isEditing ? {display: "none"} : {display: "flex"}}>
          {user.stats.map((stat, index) => (
            <div key={index} className='single-stat'> {statlist[index]} : {stat+"-"+index}</div>
          ))}
        </div>

        <div id="profilpartC" data-isediting={isEditing}>
          {isOwnProfile && (
            <>
              {isDeleting ? (
                // Affichage de confirmation
                <>
                  <button className="account-button" onClick={() => setIsDeleting(false)}>
                    <img src={`${import.meta.env.BASE_URL}img/icones/retour.png`} alt='' /> Annuler
                  </button>
                  <button className="account-button" id="delete" onClick={handleDelete}>
                    <img src={`${import.meta.env.BASE_URL}img/icones/delete.png`} alt='' /> Supprimer
                  </button>
                  <p>Supprimer le compte ?</p>
                </>
              ) : (
                // Affichage des boutons standards
                <>
                  <button id="delete" className="account-button" onClick={() => setIsDeleting(true)}>
                    <img src={`${import.meta.env.BASE_URL}img/icones/delete.png`} alt='' /> Supprimer
                  </button>
                  <button className="account-button" onClick={handleLogout}>
                    <img src={`${import.meta.env.BASE_URL}img/icones/logout.png`} alt='' /> Déconnexion
                  </button>
                  <button className="account-button" onClick={() => setIsEditing(!isEditing)}>
                    <img src={`${import.meta.env.BASE_URL}img/icones/edit.png`} alt='' /> Modifier
                  </button>
                </>
              )}
            </>
          )}
        </div>

        <div id="profilpartB" data-isediting={isEditing} style={isEditing ? {display: "flex"} : {display: "none"}}>
          liste des badges, images de profil, cartes, titres
        </div>
      </div>

      <div id="profil-cards">
        {/* Ici tu pourras afficher les cartes de l'utilisateur si besoin */}
      </div>
    </div>
  );
}
}

export default Profile;
