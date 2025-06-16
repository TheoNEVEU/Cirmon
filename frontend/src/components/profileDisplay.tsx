import { useUser } from '../contexts/userContext';
import SmartImage from './smartImage';

export default function ProfileDisplay() {
  const { user } = useUser();
  
  if (!user) return <p>Pas de profil connecté</p>;
  else {
    return (
      <div id="profile_display">
        <SmartImage src={`${import.meta.env.BASE_URL}img/profiles/${user.ppURL}.png`} alt="" fallbackSrc={`${import.meta.env.BASE_URL}img/icones/plus.png`} />
        <h1>{user.username}</h1>
      </div>
    )
  };
};
