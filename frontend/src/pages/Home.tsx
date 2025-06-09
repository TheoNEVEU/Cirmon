import '../style/Home.css'
import '../style/App.css'
import { useEffect, useState } from 'react';

export default function Home() {
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
    return (
    <div id="page-container">Bienvenue sur la page d'accueil
      <div>blablabla</div>
    </div>);
  }
  else {
    return (
      <div id="page-container-loading">
        <img className="loadingImg"  src="img/illustrations/car.jpg" alt="car"/>
      </div>
    );
  }
}
