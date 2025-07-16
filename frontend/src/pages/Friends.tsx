//import { useEffect, useState } from 'react';
import { useConnection } from '../contexts/connectedContext'
//import { useUser } from '../contexts/userContext';

import '../style/App.css'

export default function Friends() {
  const { isConnected } = useConnection();
  //const { user, setUser } = useUser();

  if (isConnected) {
    return <div id="page-container">Voici la liste de tes amis</div>;
  }
  else {
    <div id="page-container-loading">
      <img className="loadingImg"  src="img/loading.png" alt="car"/>
      <h2>Connexion de la base de donnée...</h2>
    </div>
  }
}
