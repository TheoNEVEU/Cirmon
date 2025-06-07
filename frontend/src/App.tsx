import React from 'react';
import StatusSquare from './components/statusSquare';
import './style/App.css'

function App() {
  return (
    <div>
      <h1>Statut de connexion MongoDB</h1>
      <StatusSquare />
    </div>
  );
}

export default App;
