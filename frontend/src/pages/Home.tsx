//import { useEffect, useState } from 'react';
import { useConnection } from '../contexts/connectedContext'
import { useUser } from '../contexts/userContext';
import { usePage } from '../contexts/pageContext';

import ProfileDisplay from '../components/profileDisplay'

import '../style/Home.css'

export default function Home() {
  const { user } = useUser();
  const { status } = useConnection();
  const { setActivePage } = usePage();

  if (!(status=='connected')) {
    return (
      <div id="page-container-loading">
        <img className="loadingImg"  src="img/loading.png" alt="car"/>
        <h2>Connexion à la base de données...</h2>
      </div>
    );
  }
  else {
    return (
      <div id="home-page-container"><ProfileDisplay/>
        {!user? null :
          <div id='currency-display'><img src={`${import.meta.env.BASE_URL}img/currency.png`}></img>{user?.diamonds}</div>
        }
        <div id="message-display"></div>
        <div id="booster-cover" className='placeholder'> </div>
        <button className="green-btn" style={user && user.diamonds >= 200 ? undefined : {filter: "grayscale(1)"}} onClick={() => {user && user.diamonds >= 200 ? setActivePage('boosters') : null}}>Ouvrir 1</button>
      </div>
    );
  }
}
