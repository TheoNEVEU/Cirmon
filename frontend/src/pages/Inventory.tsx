import { useEffect, useState } from 'react';

import { useUser } from '../contexts/userContext';
import { useConnection } from '../contexts/connectedContext';
import CardDetails from "../components/card";

import '../style/Inventory.css';

export default function Inventory() {
  const { user } = useUser();
  const { status } = useConnection();

  const [cards, setCards] = useState<any[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [activeTypeFilter, setactiveTypeFilter] = useState('none');
  const [activeRarityFilter, setactiveRarityFilter] = useState('none');

  useEffect(() => {
    const fetchCards = async () => {
      if (!user || !user.cards) return;
      const fetchedCards = await Promise.all(
        user.cards.map(async (c) => {
          const res = await fetch(`https://testcirmon.onrender.com/cards/${c.numPokedex}`);
          const data = await res.json();
          if (data.success) {
            return {
              ...data.card,
              quantity: c.quantity,
            };
          } else {
            return null;
          }
        })
      );

      setCards(fetchedCards.filter(Boolean)); // on filtre les erreurs
      setLoadingCards(false);
    };
    fetchCards();
  }, [user]);

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

  if (status !== 'connected' || loadingCards) {
    return (
      <div id="page-container-loading">
        <img className="loadingImg" src="img/loading.png" alt="car" />
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
            {/* <label>Type</label><br></br> */}
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
            {/* <label>Rareté</label><br></br> */}
            <button className="filterraritybuttons" data-selectedfilter={(activeRarityFilter == "none" || activeRarityFilter == "5") ? true : undefined}>
              <img onClick={() => inventoryFilter('rarity','5')} src={`${import.meta.env.BASE_URL}img/rarities/triangle.png`}></img>
            </button>
            <button className="filterraritybuttons" data-selectedfilter={(activeRarityFilter == "none" || activeRarityFilter == "4") ? true : undefined}>
              <img onClick={() => inventoryFilter('rarity','4')} src={`${import.meta.env.BASE_URL}img/rarities/diamond.png`}></img>
            </button>
            <button className="filterraritybuttons" data-selectedfilter={(activeRarityFilter == "none" || activeRarityFilter == "3") ? true : undefined}>
              <img onClick={() => inventoryFilter('rarity','3')} src={`${import.meta.env.BASE_URL}img/rarities/star.png`}></img>
            </button>
            <button className="filterraritybuttons" data-selectedfilter={(activeRarityFilter == "none" || activeRarityFilter == "2") ? true : undefined}>
              <img onClick={() => inventoryFilter('rarity','2')} src={`${import.meta.env.BASE_URL}img/rarities/crown.png`}></img>
            </button>
            <button className="filterraritybuttons" data-selectedfilter={(activeRarityFilter == "none" || activeRarityFilter == "1") ? true : undefined}>
              <img onClick={() => inventoryFilter('rarity','1')} src={`${import.meta.env.BASE_URL}img/rarities/rainbow.png`}></img>
            </button>
          </fieldset>
        </div>
      </div>
      <div id="cards-container">
        {cards.map((card, index) => {
          if (card.quantity === 0) return null;
          if (activeTypeFilter !== 'none' && card.type.toLowerCase() !== activeTypeFilter) return null;
          if (activeRarityFilter !== 'none' && card.rarity.toString() !== activeRarityFilter) return null;

          return <CardDetails key={index} card={card} />;
        })}
      </div>
    </div>
    );
  }
}

