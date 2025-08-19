import '../style/App.css'
import '../style/Friend.css';
import { useConnection } from '../contexts/connectedContext'
import { useEffect, useState } from 'react';
import { useUser } from '../contexts/userContext';
import { useApi } from '../contexts/ApiProviderContext';

import '../style/App.css'

export default function Friends() {
  const isConnected = useConnection();
  const {user} = useUser();
  const { baseUrl } = useApi();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [friends, setFriends] = useState<string[]>([]);

  useEffect(() => {
    user?.friends.sort((a, b) => a.localeCompare(b));
    const fetchCard = async () => {
      try {
        const response = await fetch(`${baseUrl}/users/friends/${user?.username}`);
        const data = await response.json();
        if (data.success) {
          setFriends(data.friends);
        }
        else {
          setError(`Liste d'amis de ${user?.username} introuvable`);
        }
      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  });

  if (isConnected) {
    console.log(friends);
    if (friends.length > 0) {
      return (
        <div id="page-container">
          <h1>Amis</h1>
          <p>{friends.length}</p>
        </div>
      );
    }
    else {
      return (
        <div id="page-container" className="page-container-no-friends">
          <h1>vous n'avez aucun ami :</h1>
          <p>{friends.length}</p>
          <img className="noFriends" src="img/yoshi.gif" alt="no friends"/>
        </div>
      );
    }
  }
  else {
    return (
      <div id="page-container-loading">
        <img className="loadingImg"  src="img/loading.png" alt="car"/>
        <h2>Connexion de la base de donnée...</h2>
      </div>
    );
  }
}
