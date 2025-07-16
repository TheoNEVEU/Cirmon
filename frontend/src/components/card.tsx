import { useState, useEffect } from 'react';
import SmartImage from './smartImage';

import './style/card.css'

interface Card {
  _id: string;
  idPokedex: number;
  name: string;
  quantity: number;
  description?: string;
  image?: string;
  illustration?: string;
  hp: number;
  type: string;
  attacks: string[];
  retreatCost: number;
  rarity: number;
  [key: string]: any;
}

interface CardDetailsProps {
  idPokedex: number;
  typeFilter: string;
  rarityFilter: string;
  quantity: number;
}

export default function CardDetails({ idPokedex, typeFilter, rarityFilter, quantity }: CardDetailsProps) {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await fetch(`https://testcirmon.onrender.com/cards/${idPokedex}`);
        const data = await response.json();
        if (data.success) {
          setCard(data.card);
          setImgSrc(`img/illustrations/${data.card.illustration}.png`);
        } else {
          setError('Carte n°'+idPokedex+' non trouvée');
        }
      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [idPokedex]);

  if (loading) return <div>Chargement...</div>;
  if (error) {
    console.error(error);
    return (
    <><div className="card" id={"none"} data-error="true">
      <img src={`${import.meta.env.BASE_URL}img/cardback.png`}/>
    </div></>);
  }
  if (!card) return (
    <><div className="card" id={"none"} data-error="true">
      <img src={`${import.meta.env.BASE_URL}img/cardback.png`}/>
    </div></>);

  if(typeFilter!="none" && card.type.toLowerCase() != typeFilter) return "";
  if(rarityFilter!="none" && card.rarity.toString() != rarityFilter) return "";
  if(quantity == 0) return "";
  return (
    <div className="card" id={`card-${card.id_}`} data-shiny={undefined} data-rainbow={undefined} data-dark={card.type === "Dark"}>
      <img
        src={`${import.meta.env.BASE_URL}img/fondsCartes/${card.type}.png`}
        alt={`${card.type} background`}
      />

      <div className="illustration">
        <img
          src={imgSrc ?? "img/illustrations/car.jpg"}
          alt={card.name}
          onError={() => setImgSrc("img/illustrations/car.jpg")}
        />
      </div>

      <div className="name"><span>{card.name}</span></div>
      <div className="hp"><p>PV</p><span>{card.hp}</span></div>

      <div className="attacks">
        {card.attacks.map((attack: string, index: number) => (
          <div className="attack" key={index}>
            <span>{attack}</span>
          </div>
        ))}
      </div>

      <div className="retreat">
        {[...Array(card.retreatCost)].map((_, index) => (
          <img key={index} src="img/energy.png" alt="Energy" />
        ))}
      </div>

      {quantity > 0 && (
        <div className="quantity">
        <span>x{quantity}</span>
        </div>
      )}
    </div>
  );
}