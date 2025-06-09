import '../style/App.css'
import { useEffect, useState } from 'react';

export default function Friends() {
  const [connected, setConnected] = useState<boolean>(false);

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
    return <div id="page-container">Voici la liste de tes amis</div>;
  }
  else {
    <div id="page-container-loading">
      <img className="loadingImg"  src="img/loading.png" alt="car"/>
      <h2>Connexion de la base de donnée...</h2>
    </div>
  }
}
