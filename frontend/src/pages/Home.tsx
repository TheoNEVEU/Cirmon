//import { useEffect, useState } from 'react';
//import { useUser } from '../contexts/userContext';
import { useConnection } from '../contexts/connectedContext'
import ProfileDisplay from '../components/profileDisplay'

import '../style/Home.css'
import '../style/App.css'

export default function Home() {
  //const [connected, setConnected] = useState<boolean>(false);
  //const { user } = useUser();
  const { isConnected } = useConnection();

  if (!isConnected) {
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
        <ProfileDisplay/>
        <div id="page-container">Bienvenue sur la page d'accueil
          <div>blablabla</div>
        </div>
      </>);
  }
}
