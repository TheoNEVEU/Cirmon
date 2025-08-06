import { useEffect, useState } from 'react';

//import { useUser } from '../contexts/userContext';
import { useConnection } from '../contexts/connectedContext';
import '../style/App.css';

export default function Shop() {
  //const { user, setUser } = useUser();
  const { isConnected } = useConnection();

  if (isConnected) {
    return <div id="page-container">Bienvenue à la boutique</div>;
  }
  else {
    <div id="page-container-loading">
      <img className="loadingImg"  src="img/loading.png" alt="car"/>
      <h2>Connexion de la base de donnée...</h2>
    </div>
  }
}
