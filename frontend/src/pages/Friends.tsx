import { useConnection } from '../contexts/connectedContext'
import { useEffect, useState } from 'react';
import { useUser } from '../contexts/userContext';
import { useApiSocket  } from '../contexts/ApiSocketContext';
import { MicroProfile } from '../components/profil';

import '../style/Friend.css';

export default function Friends() {
  const { status } = useConnection();
  const {user} = useUser();
  const { baseUrl } = useApiSocket();
  const [ users, setUsers ] = useState<Array<any>>([]);

  useEffect(() => {
      fetch(`${baseUrl}/users`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.users)) {
          setUsers(data.users);
          console.log(data.users);
        } else {
          console.error('Erreur API :', data.message);
        }
      })
      .catch(err => console.error('Erreur réseau :', err));
  }, [setUsers]);


  if (!(status=="connected")) {
    return (
      <div id="page-container-loading">
        <img className="loadingImg"  src="img/loading.png" alt="car"/>
        <h2>Connexion de la base de donnée...</h2>
      </div>
    );    
  }
  else {
    return (
    <>
      <div className="user-list">
        {users.map(user => (
          <MicroProfile userToDisplay={user} key={user._id} />
        ))}
      </div>
    </>
  );}
}
