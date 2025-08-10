// import { /*useEffect,*/ useState } from 'react';
// //import { useUser } from '../contexts/userContext';
// import CardDetails, {type Card} from "../components/card";
// import { useUser } from '../contexts/userContext';
// import { usePage } from '../contexts/pageContext';

// import '../style/BoosterOpening.css'

// export default function BoosterOpening() {
//   const { user } = useUser();
//   const [cards, setCards] = useState<Card[]>([]);
//   const { activePage, setActivePage } = usePage();

//   const [ isAnimation , setAnimation] = useState<boolean>(false);
//   const [spreadCards, setSpreadCards] = useState(false);
//   const [flippedCards, setFlippedCards] = useState<number[]>([]);
//   const [finalizedCards, setFinalizedCards] = useState<number[]>([]);


//   const pickRandomCards = async () => {
//     setSpreadCards(false);
//     setFlippedCards([]);

//     try {
//       const response = await fetch("https://testcirmon.onrender.com/booster/open", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username: user?.username })
//       });
//       const data = await response.json();

//       if (data.error) {
//         console.log(data.error);
//       } else {
//         setCards(data.booster);
//         setAnimation(true);

//         setTimeout(() => {
//           setSpreadCards(true);

//           data.booster.forEach((_ : { idPokedex: number; quantity: number }, i: number) => {
//             setTimeout(() => {
//               setFlippedCards(prev => [...prev, i]);
//               setTimeout(() => {
//                 setFinalizedCards(prev => [...prev, i]);
//               }, 800);
//             }, 300 * i + 1000); // 300ms entre chaque flip
//           });
//         }, 2000);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };


//   return(
//   <div id="booster-container" data-booster={activePage === 'boosters' ? true : undefined} data-clicked={isAnimation==true ? true : undefined}>
//     <div id="booster-opening" onClick={() => pickRandomCards()} ></div>
//     <div id="boosterCardsDisplay">
//       {cards.map((card, index) => {
//       const offset = (index - (cards.length - 1) / 2) * 17;
//       const isFlipped = flippedCards.includes(index);
//       const isFinalized = finalizedCards.includes(index);

//       if (isFinalized) {
//         return (
//           <CardDetails key={index} card={card} style={{
//             left: `calc(50% + ${offset}vw)`,
//           }}/>
//         );
//       }
//       return (
//         <div
//           key={index}
//           className="card-flip-wrapper"
//           style={{
//             left: spreadCards ? `calc(50% + ${offset}vw)` : '50%',
//           }}
//         >
//           <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
//             <div className="card-face card-back">
//               <img src={`${import.meta.env.BASE_URL}img/cardback.png`} alt="Dos de carte" />
//             </div>
//             <div className="card-face card-front">
//               <CardDetails card={card}/>
//             </div>
//           </div>
//         </div>
//       );
//     })}
//     </div>
//   </div>
//   );
// }

import { useState } from 'react';
import CardDetails, { type Card } from "../components/card";
import { useUser } from '../contexts/userContext'; // J'imagine que tu as un setUser ici aussi
import { usePage } from '../contexts/pageContext';

import '../style/BoosterOpening.css';

export default function BoosterOpening() {
  const { user, setUser } = useUser();  // <-- Récupérer setUser aussi
  const [cards, setCards] = useState<Card[]>([]);
  const { activePage, setActivePage } = usePage();

  const [isAnimation, setAnimation] = useState<boolean>(false);
  const [spreadCards, setSpreadCards] = useState(false);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [finalizedCards, setFinalizedCards] = useState<number[]>([]);

  const pickRandomCards = async () => {
    if (!user) return;
    setCards([]);
    setAnimation(false)
    setSpreadCards(false);
    setFlippedCards([]);
    setFinalizedCards([]);

    try {
      const response = await fetch("https://testcirmon.onrender.com/booster/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username }),
      });
      const data = await response.json();
      if (data.error) {
        return;
      }
      setUser({
        ...user,
        diamonds: data.diamonds,
        cards: data.inventory,
      });
      setCards(data.booster);
      setAnimation(true);
      setTimeout(() => {
        setSpreadCards(true);
        data.booster.forEach((_ : { idPokedex: number; quantity: number }, i: number) => {
          setTimeout(() => {
            setFlippedCards(prev => [...prev, i]);
            setTimeout(() => {
              setFinalizedCards(prev => [...prev, i]);
            }, 800);
          }, 500 * i + 1000);
        });
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="booster-container" data-booster={activePage === 'boosters' ? true : undefined} data-clicked={isAnimation ? true : undefined}>
      <div id="booster-opening" onClick={pickRandomCards} className='placeholder'></div>
      <div id="boosterCardsDisplay">
        {cards.map((card, index) => {
          const offset = (index - (cards.length - 1) / 2) * 17;
          const isFlipped = flippedCards.includes(index);
          const isFinalized = finalizedCards.includes(index);

          if (isFinalized) {
            return (
              <CardDetails
                key={index}
                card={card}
                style={{
                  left: `calc(50% + ${offset}vw)`,
                }}
              />
            );
          }

          return (
            <div
              key={index}
              className="card-flip-wrapper"
              style={{
                left: spreadCards ? `calc(50% + ${offset}vw)` : '50%',
              }}
            >
              <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
                <div className="card-face card-back">
                  <img src={`${import.meta.env.BASE_URL}img/cardback.png`} alt="Dos de carte" />
                </div>
                <div className="card-face card-front">
                  <CardDetails card={card} />
                </div>
              </div>
            </div>
          );
        })}
        {finalizedCards.length === 5 && (
          <button style={{top:"100%"}} className="green-btn" onClick={() => {
            setActivePage('home');
            setCards([]);
            setAnimation(false)
            setSpreadCards(false);
            setFlippedCards([]);
            setFinalizedCards([]);
          }}>Collecter</button>
        )}
      </div>
    </div>
  );
}
