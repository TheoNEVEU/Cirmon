import CardDetails from "../components/card";
import { useEffect, useState } from 'react';
import '../style/Inventory.css';

export default function Inventory() {
  const [activeTypeFilter, setactiveTypeFilter] = useState('none');
  const [activeRarityFilter, setactiveRarityFilter] = useState('none');
  const [connected, setConnected] = useState<boolean>(false);
  const [cards, setCards] = useState<{ numPokedex: number; quantity: number }[]>([]);

  function inventorySort(sortType: string) {
    const sortButtons = document.querySelectorAll(".sortbuttons");
    sortButtons.forEach((button) => {
      if ((button as HTMLButtonElement).value.toLowerCase() === sortType.toLowerCase()) button.setAttribute("data-selectedsort", "true");
      else button.removeAttribute("data-selectedsort");
    });
  // Construire ici la fonction de tri des cartes quand on aura fait les inventaires
  }

  function inventoryFilter(filterName: string, filter: string) {
    if(filterName=="type") {
      if(activeTypeFilter==filter) setactiveTypeFilter("none");
      else setactiveTypeFilter(filter);
    }
    else {
      if(activeRarityFilter==filter) setactiveRarityFilter("none");
      else setactiveRarityFilter(filter);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('https://testcirmon.onrender.com/users', {headers: { 'Authorization': `Bearer ${token}`}})
        .then(res => res.json())
        .then(data => {
          if (data.success) { 
            setConnected(true);
            setCards(data.user.cards);
            console.log(data.user.cards);
          } 
          else {
            console.error('Erreur API :', data.message);
          }
        })
        .catch(err => console.error('Erreur réseau :', err));
    }
    else {
      console.log("utilisateur non connecté")
    }
  }, []);

  if (connected) {
    return (
    <div id="page-container">
      <div id="inventory-menu">
        <div id="sortlist">
          <span>Trier par :</span>
          <button value="rarity" className="sortbuttons" onClick={() => inventorySort('rarity')}>Rareté</button>
          <button value="number" className="sortbuttons" onClick={() => inventorySort('number')}>Numéro</button>
          <button value="type" className="sortbuttons" onClick={() => inventorySort('type')}>Type</button>
          <button value="quantity" className="sortbuttons" onClick={() => inventorySort('quantity')}>Quantité</button>
        </div>
        <div id="filterlist">
          <span>Filtrer par :</span>
          <fieldset className="filter-parram">
            <label>Type</label><br></br>
            <button className="filtertypebuttons" data-selectedfilter={(activeTypeFilter == "none" || activeTypeFilter == "normal") ? true : undefined}>
              <img onClick={() => inventoryFilter('type','normal')} src={`${import.meta.env.BASE_URL}img/energies/normal.png`}></img>
            </button>
            <button className="filtertypebuttons" data-selectedfilter={(activeTypeFilter == "none" || activeTypeFilter == "grass") ? true : undefined}>
              <img onClick={() => inventoryFilter('type','grass')} src={`${import.meta.env.BASE_URL}img/energies/grass.png`}></img>
            </button>
            <button className="filtertypebuttons" data-selectedfilter={(activeTypeFilter == "none" || activeTypeFilter == "fire") ? true : undefined}>
              <img onClick={() => inventoryFilter('type','fire')} src={`${import.meta.env.BASE_URL}img/energies/fire.png`}></img>
            </button>
            <button className="filtertypebuttons" data-selectedfilter={(activeTypeFilter == "none" || activeTypeFilter == "water") ? true : undefined}>
              <img onClick={() => inventoryFilter('type','water')} src={`${import.meta.env.BASE_URL}img/energies/water.png`}></img>
            </button>
            <button className="filtertypebuttons" data-selectedfilter={(activeTypeFilter == "none" || activeTypeFilter == "electric") ? true : undefined}>
              <img onClick={() => inventoryFilter('type','electric')} src={`${import.meta.env.BASE_URL}img/energies/electric.png`}></img>
            </button>
            <button className="filtertypebuttons" data-selectedfilter={(activeTypeFilter == "none" || activeTypeFilter == "fight") ? true : undefined}>
              <img onClick={() => inventoryFilter('type','fight')} src={`${import.meta.env.BASE_URL}img/energies/fight.png`}></img>
            </button>
            <button className="filtertypebuttons" data-selectedfilter={(activeTypeFilter == "none" || activeTypeFilter == "psy") ? true : undefined}>
              <img onClick={() => inventoryFilter('type','psy')} src={`${import.meta.env.BASE_URL}img/energies/psy.png`}></img>
            </button>
            <button className="filtertypebuttons" data-selectedfilter={(activeTypeFilter == "none" || activeTypeFilter == "dark") ? true : undefined}>
              <img onClick={() => inventoryFilter('type','dark')} src={`${import.meta.env.BASE_URL}img/energies/dark.png`}></img>
            </button>
          </fieldset>
          <fieldset className="filter-parram">
            <label>Rareté</label><br></br>
            <button className="filterraritybuttons" data-selectedfilter={(activeRarityFilter == "none" || activeRarityFilter == "1") ? true : undefined}>
              <img onClick={() => inventoryFilter('rarity','1')} src={`${import.meta.env.BASE_URL}img/energies/grass.png`}></img>
            </button>
            <button className="filterraritybuttons" data-selectedfilter={(activeRarityFilter == "none" || activeRarityFilter == "2") ? true : undefined}>
              <img onClick={() => inventoryFilter('rarity','2')} src={`${import.meta.env.BASE_URL}img/energies/fire.png`}></img>
            </button>
            <button className="filterraritybuttons" data-selectedfilter={(activeRarityFilter == "none" || activeRarityFilter == "3") ? true : undefined}>
              <img onClick={() => inventoryFilter('rarity','3')} src={`${import.meta.env.BASE_URL}img/energies/water.png`}></img>
            </button>
            <button className="filterraritybuttons" data-selectedfilter={(activeRarityFilter == "none" || activeRarityFilter == "4") ? true : undefined}>
              <img onClick={() => inventoryFilter('rarity','4')} src={`${import.meta.env.BASE_URL}img/energies/electric.png`}></img>
            </button>
            <button className="filterraritybuttons" data-selectedfilter={(activeRarityFilter == "none" || activeRarityFilter == "5") ? true : undefined}>
              <img onClick={() => inventoryFilter('rarity','5')} src={`${import.meta.env.BASE_URL}img/energies/fight.png`}></img>
            </button>
          </fieldset>
        </div>
      </div>
      <div id="cards-container">
        {cards && cards.length > 0 && cards.map((card) => (
          <CardDetails
            idPokedex={card.numPokedex}
            typeFilter={activeTypeFilter}
            rarityFilter={activeRarityFilter}
            quantity={card.quantity}
          />
        ))}
        {/* <CardDetails idPokedex={1} typeFilter={activeTypeFilter} rarityFilter={activeRarityFilter} quantity={1}/>
        <CardDetails idPokedex={2} typeFilter={activeTypeFilter} rarityFilter={activeRarityFilter} quantity={1}/>
        <CardDetails idPokedex={3} typeFilter={activeTypeFilter} rarityFilter={activeRarityFilter} quantity={999}/>
        <CardDetails idPokedex={4} typeFilter={activeTypeFilter} rarityFilter={activeRarityFilter} quantity={5}/>
        <CardDetails idPokedex={5} typeFilter={activeTypeFilter} rarityFilter={activeRarityFilter} quantity={1}/>
        <CardDetails idPokedex={6} typeFilter={activeTypeFilter} rarityFilter={activeRarityFilter} quantity={1}/>
        <CardDetails idPokedex={7} typeFilter={activeTypeFilter} rarityFilter={activeRarityFilter} quantity={1}/>
        <CardDetails idPokedex={8} typeFilter={activeTypeFilter} rarityFilter={activeRarityFilter} quantity={1}/>
        <CardDetails idPokedex={9} typeFilter={activeTypeFilter} rarityFilter={activeRarityFilter} quantity={1}/> */}
      </div>
    </div>
    );
  }
  else {
    return (
      <div id="page-container-loading">
        <img className="loadingImg"  src="img/loading.png" alt="car"/>
        <h2>Connexion de la base de donnée...</h2>
      </div>
    );
  }
}

