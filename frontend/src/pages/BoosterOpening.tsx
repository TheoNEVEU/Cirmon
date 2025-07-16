import { /*useEffect,*/ useState } from 'react';
//import { useUser } from '../contexts/userContext';
import CardDetails from "../components/card";

import '../style/BoosterOpening.css'

const rarityChances: Record<number, number> = {
  5: 0.40,
  4: 0.30,
  3: 0.20,
  2: 0.09,
  1: 0.01,
};

export default function BoosterOpening() {
  const [cards, setCards] = useState<{ idPokedex: number; quantity: number }[]>([]);

  const pickRandomCards = async () => {
    try {
      const response = await fetch(`https://testcirmon.onrender.com/booster`);
      const data = await response.json();
      if (data.error) {
        console.log(data.error);
      } else {
        setCards(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return(
  <div id="container">
    <button onClick={() => pickRandomCards()}></button>
    {cards.map((card, index) => (
      <CardDetails
        key={index}
        idPokedex={card.idPokedex}
        typeFilter="none"
        rarityFilter="none"
        quantity={-1}
      />
    ))}
  </div>
  );
}
