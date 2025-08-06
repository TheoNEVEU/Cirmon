import { /*useEffect,*/ useState } from 'react';
//import { useUser } from '../contexts/userContext';
import CardDetails from "../components/card";
import { usePage } from '../contexts/pageContext';

import '../style/BoosterOpening.css'

export default function BoosterOpening() {
  const [cards, setCards] = useState<{ idPokedex: number; quantity: number }[]>([]);
  const { activePage, setActivePage } = usePage();

  const [ isAnimation , setAnimation] = useState<boolean>(false);
  const [spreadCards, setSpreadCards] = useState(false);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [finalizedCards, setFinalizedCards] = useState<number[]>([]);


  const pickRandomCards = async () => {
    setSpreadCards(false);
    setFlippedCards([]);

    try {
      const response = await fetch(`https://testcirmon.onrender.com/booster`);
      const data = await response.json();

      if (data.error) {
        console.log(data.error);
      } else {
        setCards(data.booster);
        setAnimation(true);

        setTimeout(() => {
          setSpreadCards(true);

          data.booster.forEach((_ : { idPokedex: number; quantity: number }, i: number) => {
            setTimeout(() => {
              setFlippedCards(prev => [...prev, i]);
              setTimeout(() => {
                //setFinalizedCards(prev => [...prev, i]);
              }, 800);
            }, 300 * i + 1000); // 300ms entre chaque flip
          });
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };


  return(
  <div id="booster-container" data-booster={activePage === 'boosters' ? true : undefined} data-clicked={isAnimation==true ? true : undefined}>
    <div id="booster-opening" onClick={() => pickRandomCards()} ></div>
    <div id="boosterCardsDisplay">
      {cards.map((card, index) => {
      const offset = (index - (cards.length - 1) / 2) * 17;
      const isFlipped = flippedCards.includes(index);
      const isFinalized = finalizedCards.includes(index);

      if (isFinalized) {
        return (
          <div
            key={index}
            className="card-final"
            style={{
              left: `calc(50% + ${offset}vw)`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              position: 'absolute',
            }}
          >
            <CardDetails
              idPokedex={card.idPokedex}
              typeFilter="none"
              rarityFilter="none"
              quantity={-1}
            />
          </div>
        );
      }

      return (
        <div
          key={index}
          className="card-flip-wrapper"
          style={{
            left: spreadCards ? `calc(50% + ${offset}vw)` : '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            position: 'absolute',
            transition: 'left 0.6s ease',
          }}
        >
          <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
            <div className="card-face card-back">
              <img src={`${import.meta.env.BASE_URL}img/cardback.png`} alt="Dos de carte" />
            </div>
            <div className="card-face card-front">
              <CardDetails
                idPokedex={card.idPokedex}
                typeFilter="none"
                rarityFilter="none"
                quantity={-1}
              />
            </div>
          </div>
        </div>
      );
    })}
    </div>
  </div>
  );
}
