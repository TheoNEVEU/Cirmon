import { useState } from 'react';
import './style/card.css'

export type Card = {
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
  card: Card;
  style?: React.CSSProperties;
}

export default function CardDetails({ card, style }: CardDetailsProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  if (!card) return (
    <><div className="card" id={"none"} data-error="true">
      <img src={`${import.meta.env.BASE_URL}img/cardback.png`}/>
    </div></>);
  return (
    <div className="card" id={`card-${card.id_}`} data-shiny={undefined} data-rainbow={undefined} data-dark={card.type === "Dark"} style={style}>
      <img
        src={`${import.meta.env.BASE_URL}img/fondsCartes/${card.type}.png`}
        alt={`${card.type} background`}
      />

      <div className="illustration">
        <img
          src={imgSrc ?? "img/car.jpg"}
          alt={card.name}
          onError={() => setImgSrc("img/car.jpg")}
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

      {card.quantity > 0 && (
        <div className="quantity">
        <span>x{card.quantity}</span>
        </div>
      )}
    </div>
  );
}