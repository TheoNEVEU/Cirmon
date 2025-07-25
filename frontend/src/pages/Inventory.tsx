import { /*useEffect,*/ useState } from 'react';

import { useUser } from '../contexts/userContext';
import { useConnection } from '../contexts/connectedContext';
import CardDetails from "../components/card";

import '../style/Inventory.css';

export default function Inventory() {
  const { user } = useUser();
  const { isConnected } = useConnection();

  const [activeTypeFilter, setactiveTypeFilter] = useState('none');
  const [activeRarityFilter, setactiveRarityFilter] = useState('none');

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

  if (!isConnected) {
    return (
      <div id="page-container-loading">
        <img className="loadingImg"  src="img/loading.png" alt="car"/>
        <h2>Chargement du profil...</h2>
      </div>
    );
  }    
  else {
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
        {user && user.cards.length > 0 && user.cards.map((card, index) => (
          <CardDetails
            key={index}
            idPokedex={card.numPokedex}
            typeFilter={activeTypeFilter}
            rarityFilter={activeRarityFilter}
            quantity={card.quantity}
          />
        ))}
        {!user && <p>Vous n'êtes pas connecté</p>}
      </div>
    </div>
    );
  }
}

