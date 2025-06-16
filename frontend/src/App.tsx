import { useState, useEffect, useRef } from 'react';
import './style/App.css';

import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Friends from './pages/Friends';
import Shop from './pages/Shop';
import Account from './pages/Account';
import StatusSquare from './components/statusSquare';
import { useUser } from './contexts/userContext';

function App() {
  const [indicatorTop, setIndicatorTop] = useState(0);
  const [indicatorLeft, setIndicatorLeft] = useState(0);
  const { setUser } = useUser();

  type Page = 'home' | 'inventory' | 'friends' | 'shop' | 'account';
  const [activePage, setActivePage] = useState<Page>('home');

  const buttonRefs: Record<Page, React.RefObject<HTMLButtonElement | null>> = {
    home: useRef<HTMLButtonElement | null>(null),
    inventory: useRef<HTMLButtonElement | null>(null),
    friends: useRef<HTMLButtonElement | null>(null),
    shop: useRef<HTMLButtonElement | null>(null),
    account: useRef<HTMLButtonElement | null>(null),
  }; 

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
      setIndicatorLeft(ref.current.offsetLeft);
    }
  }, [activePage]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('https://testcirmon.onrender.com/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUser(data.user);
          } else {
            console.error('Erreur API :', data.message);
          }
        })
        .catch(err => console.error('Erreur réseau :', err));
    }
  }, [setUser]);

  return (
    <div id="app-container">
      <StatusSquare />
      <div id="grid-container-sidebar">
        <div id="sidebar">
          <div className="active-indicator" style={{ top: indicatorTop, left: indicatorLeft }} />

          <button onClick={() => handleClick('home')} ref={buttonRefs.home}>
            <img src={`${import.meta.env.BASE_URL}img/icones/home.png`} className="nav-icon" />
          </button>
          <button onClick={() => handleClick('inventory')} ref={buttonRefs.inventory}>
            <img src={`${import.meta.env.BASE_URL}img/icones/inventory.png`} className="nav-icon" />
          </button>
          <button onClick={() => handleClick('friends')} ref={buttonRefs.friends}>
            <img src={`${import.meta.env.BASE_URL}img/icones/users.png`} className="nav-icon" />
          </button>
          <button onClick={() => handleClick('shop')} ref={buttonRefs.shop}>
            <img src={`${import.meta.env.BASE_URL}img/icones/shop.png`} className="nav-icon" />
          </button>
          <button onClick={() => handleClick('account')} ref={buttonRefs.account}>
            <img src={`${import.meta.env.BASE_URL}img/icones/account.png`} className="nav-icon" />
          </button>
        </div>
      </div>

      <div id="grid-container-content">
          <div className={`page ${activePage === 'home' ? 'active' : ''}`}><Home /></div>
          <div className={`page ${activePage === 'inventory' ? 'active' : ''}`}><Inventory /></div>
          <div className={`page ${activePage === 'friends' ? 'active' : ''}`}><Friends /></div>
          <div className={`page ${activePage === 'shop' ? 'active' : ''}`}><Shop /></div>
          <div className={`page ${activePage === 'account' ? 'active' : ''}`}><Account /></div>
      </div>
    </div>
  );
}

export default App;