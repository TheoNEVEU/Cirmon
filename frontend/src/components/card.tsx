import React from "react";

interface CardProps {
  id: number;
  name: string;
  type: string;
  imageUrl: string; // URL de l'illustration du Pokémon
  hp: number;
  attacks: string[];
  retreatCost: number; // La valeur de retreatCost que tu veux afficher
  quantity: number;
  isShiny: boolean;
  isRainbow: boolean;
}

const Card: React.FC<CardProps> = ({ id, type, name, hp, attacks, retreatCost, imageUrl, quantity, isShiny, isRainbow }) => {
  return (
    <div className="card" id={"card-"+id} data-shiny={isShiny ? true : undefined} data-rainbow={isRainbow ? true : undefined}>
      <img src={"img/fondsCartes/"+type+".png"} alt="" />
      <div className="illustration">
        <img src={"img/illustrations/"+imageUrl+".png"} alt={name} />
      </div>
      <div className="name"><span>{name}</span></div>
      <div className="hp"><span>{hp}</span></div>
      <div className="attacks">
        {attacks.map((attack, index) => (
          <div className="attack" key={index}>
            <span>{attack}</span>
          </div>
        ))}
      </div>
      <div className="retreat">
        {/* Afficher l'image energy.png autant de fois que retreatCost */}
        {[...Array(retreatCost)].map((_, index) => (
          <img key={index} src="img/energy.png" alt="Energy" />
        ))}
      </div>
      <div className="quantity"><span>x{quantity}</span></div>
    </div>
  );
};

export default Card;
