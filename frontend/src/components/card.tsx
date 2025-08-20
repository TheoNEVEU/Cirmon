import SmartImage from './smartImage';
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
  hoverEffects?: boolean;
}

export default function CardDetails({ card, style, hoverEffects }: CardDetailsProps) {
  const rarities = ["rainbow", "crown", "star", "diamond", "triangle"];

  if (!card) return (
    <><div className="card" id={"none"} data-error="true">
      <img src={`${import.meta.env.BASE_URL}img/cardback.png`}/>
    </div></>);
  return (
    <div className="card" id={`card-${card.idPokedex}`} data-shiny={card.rarity == 2 && hoverEffects} data-rainbow={card.rarity == 1 && hoverEffects} data-dark={card.type === "Dark"} data-hovereffects={hoverEffects == true} style={style}>
      <img
        src={`${import.meta.env.BASE_URL}img/fondsCartes/${card.type}.png`}
        alt={`${card.type} background`}
      />

      <div className="illustration">
        <SmartImage src={`${import.meta.env.BASE_URL}img/illustrations/${card.illustration}.png`} fallbackSrc='img/car.jpg'></SmartImage>
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

      <div className="rarity">
        <SmartImage src={`${import.meta.env.BASE_URL}img/rarities/${rarities[card.rarity-1]}.png`} fallbackSrc='img/car.jpg'></SmartImage>
      </div>

      {card.quantity > 0 && (
        <div className="quantity">
        <span>x{card.quantity}</span>
        </div>
      )}
    </div>
  );
}