import { useEffect, useState } from 'react';
//import { useUser } from '../contexts/userContext';
import '../style/App.css';

export default function Shop() {
  const [connected, setConnected] = useState<boolean>(false);
  //const { user, setUser } = useUser();

  useEffect(() => {
    fetch('https://testcirmon.onrender.com/test') // remplace par ton URL backend
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setConnected(true);
      })
      .catch(() => {
        setConnected(false)
        console.log("BDD Connectée");
      });
  }, []);

  if (connected) {
    return <div id="page-container">Bienvenue à la boutique</div>;
  }
  else {
    <div id="page-container-loading">
      <img className="loadingImg"  src="img/loading.png" alt="car"/>
      <h2>Connexion de la base de donnée...</h2>
    </div>
  }
}
