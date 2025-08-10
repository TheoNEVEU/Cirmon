import { useEffect, useState } from 'react';

import { useUser } from '../contexts/userContext';
import { useConnection } from '../contexts/connectedContext';
import CardDetails, { type Card as CardType } from "../components/card";

import '../style/Inventory.css';

export default function Inventory() {
  const { user } = useUser();
  const { status } = useConnection();

  const [cards, setCards] = useState<any[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);

  const [sortField, setSortField] = useState("");
  const [activeTypeFilter, setactiveTypeFilter] = useState('none');
  const [activeRarityFilter, setactiveRarityFilter] = useState('none');

  const [showMissingCards, setShowMissingCards] = useState<boolean>(false);

  // useEffect(() => {
  //   const fetchUserCards = async () => {
  //     if (!user || !user.cards) return;
  //     const fetchedCards = await Promise.all(
  //       user.cards.map(async (c) => {
  //         const res = await fetch(`https://testcirmon.onrender.com/cards/${c.idPokedex}`);
  //         const data = await res.json();
  //         if (data.success) {
  //           return {
  //             ...data.card,
  //             quantity: c.quantity,
  //           };
  //         } else {
  //           return null;
  //         }
  //       })
  //     );
  //     const sortedCards = fetchedCards
  //     .filter(Boolean)
  //     .sort((a, b) => a.idPokedex - b.idPokedex);
  //     setCards(sortedCards);
  //     setSortField("idPokedex");
  //     setLoadingCards(false);
  //   };
  //   fetchUserCards();
  // }, [user]);


useEffect(() => {
  const fetchCards = async () => {
    if (!user) return;

    try {
      const allRes = await fetch("https://testcirmon.onrender.com/cards");
      const allData = await allRes.json();

      // supporte response = [] ou { cards: [...] }
      const allCards: any[] = Array.isArray(allData) ? allData : (allData.cards ?? []);

      // map user -> quantity (assure Number)
      const userCardMap = new Map<number, number>(
        (user.cards || []).map((c: { idPokedex: number; quantity: number }) => [
          Number(c.idPokedex),
          Number(c.quantity),
        ])
      );

      // fusion : on prend idPokedex (ou numPokedex si présent) et on met quantity
      const mergedCards: (CardType & { quantity: number; isPlaceholder: boolean })[] =
        allCards.map((card: any) => {
          const id = Number(card.idPokedex ?? card.numPokedex ?? card._id ?? -1);
          const quantity = userCardMap.get(id) ?? 0;
          return {
            ...card,
            idPokedex: id,
            quantity,
            isPlaceholder: quantity === 0,
          };
        });

      // tri (typé)
      mergedCards.sort((a: any, b: any) => Number(a.idPokedex) - Number(b.idPokedex));

      setCards(mergedCards);
    } catch (err) {
      console.error("fetchCards error:", err);
      setCards([]); // safe fallback
    } finally {
      setLoadingCards(false);
    }
  };

  fetchCards();
}, [user]);

  function inventorySort(sortType: string) {
    const sortButtons = document.querySelectorAll(".invButtons");
    sortButtons.forEach((button) => {
      if ((button as HTMLButtonElement).value.toLowerCase() === sortType.toLowerCase()) {
        button.setAttribute("data-selected", "true");
      } else {
        button.removeAttribute("data-selected");
      }
    });

    let sortedCards = [...cards].sort((a, b) => {
      switch (sortType) {
        case "idPokedex": return a.idPokedex - b.idPokedex;
        case "name": return a.name.localeCompare(b.name);
        case "rarity": return a.rarity - b.rarity;
        case "type": return a.type.localeCompare(b.type);
        case "quantity": return b.quantity - a.quantity;
        default: return 0;
      }
    });
    setCards(sortedCards);
    setSortField(sortType);
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
          <button value="number" className="invButtons" onClick={() => inventorySort('number')}>Numéro</button>
          <button value="rarity" className="invButtons" onClick={() => inventorySort('rarity')}>Rareté</button>
          <button value="name" className="invButtons" onClick={() => inventorySort('name')}>Nom</button>
          <button value="type" className="invButtons" onClick={() => inventorySort('type')}>Type</button>
          <button value="quantity" className="invButtons" onClick={() => inventorySort('quantity')}>Quantité</button>
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
          <button id='suppfilters' onClick={() => {inventoryFilter('rarity',"none");inventoryFilter('type',"none");}}> Supprimer les filtres </button>
        </div>
        <div id='otherlist'>
          <span>Autres :</span>
            <button className="invButtons" onClick={() => setShowMissingCards(!showMissingCards)} data-selected={showMissingCards ? true : undefined}> Afficher cartes manquantes </button>

        </div>
      </div>
      <div id="cards-container">
        {cards.map((card) => {
          if (!showMissingCards && card.quantity === 0) return null;
          if (activeTypeFilter !== 'none' && card.type.toLowerCase() !== activeTypeFilter) return null;
          if (activeRarityFilter !== 'none' && card.rarity.toString() !== activeRarityFilter) return null;
          if (card.isPlaceholder) {
            return (
              <div key={card.idPokedex} className="empty-card">
                <span>???<br></br>(N°{card.idPokedex})</span>
              </div>
            );
          }
          return <CardDetails key={card.idPokedex} card={card} />;
        })}
      </div>
    </div>
    );
  }
}

