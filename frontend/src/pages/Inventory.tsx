import CardDetails from "../components/card";
import '../style/Inventory.css';

export default function Inventory() {
  function inventorySort(sortType: string) {
    const sortButtons = document.querySelectorAll(".sortbuttons");
    sortButtons.forEach((button) => {
      if ((button as HTMLButtonElement).value.toLowerCase() === sortType.toLowerCase()) button.setAttribute("data-selectedsort", "true");
      else button.removeAttribute("data-selectedsort");
    });
  // Construire ici la fonction de tri des cartes quand on aura fait les inventaires
  }

  function inventoryFilter(filterType: string) {
    const filterButtons = document.querySelectorAll(".filterbuttons");
    filterButtons.forEach((button) => {
      if ((button as HTMLButtonElement).value.toLowerCase() === filterType.toLowerCase()) button.setAttribute("data-selectedfilter", "true");
      else button.removeAttribute("data-selectedfilter");
    });
  // Construire ici la fonction de filtre des cartes quand on aura fait les inventaires
  }

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
          <button value="rarity" className="filterbuttons" onClick={() => inventoryFilter('rarity')}>A</button>
          <button value="number" className="filterbuttons" onClick={() => inventoryFilter('number')}>B</button>
          <button value="type" className="filterbuttons" onClick={() => inventoryFilter('type')}>C</button>
          <button value="quantity" className="filterbuttons" onClick={() => inventoryFilter('quantity')}>D</button>
          <button value="quantity" className="filterbuttons" onClick={() => inventoryFilter('quantity')}>E</button>
          <button value="quantity" className="filterbuttons" onClick={() => inventoryFilter('quantity')}>F</button>
          <button value="quantity" className="filterbuttons" onClick={() => inventoryFilter('quantity')}>G</button>
          <button value="quantity" className="filterbuttons" onClick={() => inventoryFilter('quantity')}>H</button>
        </fieldset>
        
        
      </div>
    </div>
    <div id="cards-container">
      <CardDetails idPokedex={1} />
      {/* <Card
        id={1}
        name="Salamèche"
        hp={100}
        attacks={["Attaque 1", "Attaque 2"]}
        retreatCost={2} // Par exemple, une carte avec un coût de retraite de 3
        imageUrl="Salameche"
        type="Fire"
        quantity={3}
        isShiny={false}
        isRainbow={true}
      />
      <Card
        id={1}
        name="Salamèche"
        hp={100}
        attacks={["Attaque 1", "Attaque 2"]}
        retreatCost={2} // Par exemple, une carte avec un coût de retraite de 3
        imageUrl="Pikachu"
        type="Normal"
        quantity={3}
        isShiny={false}
        isRainbow={true}
      />  
      <Card
        id={1}
        name="Salamèche"
        hp={100}
        attacks={["Attaque 1", "Attaque 2"]}
        retreatCost={2} // Par exemple, une carte avec un coût de retraite de 3
        imageUrl="DracaufeuA"
        type="Psy"
        quantity={3}
        isShiny={true}
        isRainbow={false}
      />    
      <Card
        id={1}
        name="Salamèche"
        hp={100}
        attacks={["Attaque 1", "Attaque 2"]}
        retreatCost={2} // Par exemple, une carte avec un coût de retraite de 3
        imageUrl="DracaufeuB"
        type="Water"
        quantity={3}
        isShiny={false}
        isRainbow={false}
      />    
      <Card
        id={1}
        name="Salamèche"
        hp={100}
        attacks={["Attaque 1", "Attaque 2"]}
        retreatCost={2} // Par exemple, une carte avec un coût de retraite de 3
        imageUrl="Genesect"
        type="Electric"
        quantity={3}
        isShiny={false}
        isRainbow={false}
      />    
      <Card
        id={1}
        name="Salamèche"
        hp={100}
        attacks={["Attaque 1", "Attaque 2"]}
        retreatCost={2} // Par exemple, une carte avec un coût de retraite de 3
        imageUrl="Tyrranocif"
        type="Dark"
        quantity={3}
        isShiny={false}
        isRainbow={false}
      />
      <Card
        id={1}
        name="Salamèche"
        hp={100}
        attacks={["Attaque 1", "Attaque 2"]}
        retreatCost={2} // Par exemple, une carte avec un coût de retraite de 3
        imageUrl="Salameche"
        type="Fight"
        quantity={3}
        isShiny={false}
        isRainbow={false}
      />    
      <Card
        id={1}
        name="Salamèche"
        hp={100}
        attacks={["Attaque 1", "Attaque 2"]}
        retreatCost={2} // Par exemple, une carte avec un coût de retraite de 3
        imageUrl="Salameche"
        type="Grass"
        quantity={3}
        isShiny={false}
        isRainbow={false}
      />   */}
      
    </div>
  </div>
  );
}

