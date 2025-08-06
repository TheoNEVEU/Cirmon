//import { useEffect, useState } from 'react';
//import { useUser } from '../contexts/userContext';
import { useConnection } from '../contexts/connectedContext'
import { usePage } from '../contexts/pageContext';

import ProfileDisplay from '../components/profileDisplay'

import '../style/Home.css'

export default function Home() {
  //const { user } = useUser();
  const { status } = useConnection();
  const { setActivePage } = usePage();

  if (!(status=='connected')) {
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
        <div id="page-container"><ProfileDisplay/>
          <div id="booster-cover"></div>
          <button id="btn-open" onClick={() => setActivePage('boosters')}>Ouvrir 1</button>
        </div>
      </>);
  }
}
