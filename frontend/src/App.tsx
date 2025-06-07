import { useState, useEffect, useRef } from 'react';
import './style/App.css';

import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Friends from './pages/Friends';
import Shop from './pages/Shop';

function App() {
  const [indicatorTop, setIndicatorTop] = useState(0);

  type Page = 'home' | 'inventory' | 'friends' | 'shop';
  const [activePage, setActivePage] = useState<Page>('home');

  const buttonRefs: Record<Page, React.RefObject<HTMLButtonElement | null>> = {
    home: useRef<HTMLButtonElement | null>(null),
    inventory: useRef<HTMLButtonElement | null>(null),
    friends: useRef<HTMLButtonElement | null>(null),
    shop: useRef<HTMLButtonElement | null>(null),
  }; 

  // Lorsqu'on clique, on change la page ET on lance une animation
  const handleClick = (page: Page) => {
    setActivePage(page);

    const button = buttonRefs[page].current;
    if (button) {
      button.classList.add('clicked');
      setTimeout(() => {
        button.classList.remove('clicked');
      }, 300); // Durée de l'animation CSS
    }
  };

  useEffect(() => {
    const ref = buttonRefs[activePage];
    if (ref.current) {
      setIndicatorTop(ref.current.offsetTop);
    }
  }, [activePage]);

  return (
    <div id="app-container">
      {/* <h1>Statut de connexion MongoDB</h1>
      <StatusSquare /> */}
      <div id="grid-container-sidebar">
        <div id="sidebar">
          <div className="active-indicator" style={{ top: indicatorTop }} />

          <button onClick={() => handleClick('home')} ref={buttonRefs.home}>
            <img src="public/img/icones/home.png" className="nav-icon" />
          </button>
          <button onClick={() => handleClick('inventory')} ref={buttonRefs.inventory}>
            <img src="public/img/icones/inventory.png" className="nav-icon" />
          </button>
          <button onClick={() => handleClick('friends')} ref={buttonRefs.friends}>
            <img src="public/img/icones/users.png" className="nav-icon" />
          </button>
          <button onClick={() => handleClick('shop')} ref={buttonRefs.shop}>
            <img src="public/img/icones/shop.png" className="nav-icon" />
          </button>
        </div>
      </div>

      <div id="grid-container-content">
          <div className={`page ${activePage === 'home' ? 'active' : ''}`}><Home /></div>
          <div className={`page ${activePage === 'inventory' ? 'active' : ''}`}><Inventory /></div>
          <div className={`page ${activePage === 'friends' ? 'active' : ''}`}><Friends /></div>
          <div className={`page ${activePage === 'shop' ? 'active' : ''}`}><Shop /></div>
      </div>
    </div>
  );
}

export default App;