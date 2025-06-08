import { useState, useEffect } from 'react';

// interface CardProps {
//   id: number;
//   name: string;
//   type: string;
//   imageUrl: string; // URL de l'illustration du Pokémon
//   hp: number;
//   attacks: string[];
//   retreatCost: number; // La valeur de retreatCost que tu veux afficher
//   quantity: number;
//   isShiny: boolean;
//   isRainbow: boolean;
// }

// const Card: React.FC<CardProps> = ({ id, type, name, hp, attacks, retreatCost, imageUrl, quantity, isShiny, isRainbow }) => {
//   return (
//     <div className="card" id={"card-"+id} data-shiny={isShiny ? true : undefined} data-rainbow={isRainbow ? true : undefined}>
//       <img src={"img/fondsCartes/"+type+".png"} alt="" />
//       <div className="illustration">
//         <img src={"img/illustrations/"+imageUrl+".png"} alt={name} />
//       </div>
//       <div className="name"><span>{name}</span></div>
//       <div className="hp"><span>{hp}</span></div>
//       <div className="attacks">
//         {attacks.map((attack, index) => (
//           <div className="attack" key={index}>
//             <span>{attack}</span>
//           </div>
//         ))}
//       </div>
//       <div className="retreat">
//         {/* Afficher l'image energy.png autant de fois que retreatCost */}
//         {[...Array(retreatCost)].map((_, index) => (
//           <img key={index} src="img/energy.png" alt="Energy" />
//         ))}
//       </div>
//       <div className="quantity"><span>x{quantity}</span></div>
//     </div>
//   );
// };
//
// export default Card;

// Typage de la carte pour TypeScript
interface Card {
  _id: string;
  idPokedex: number;
  name: string;
  quantity: number;
  description?: string;
  image?: string;
  [key: string]: any; // autorise d'autres propriétés éventuelles
}

interface CardDetailsProps {
  idPokedex: number;
}

export default function CardDetails({ idPokedex }: CardDetailsProps) {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await fetch(`https://testcirmon.onrender.com/cards/${idPokedex}`);
        const data = await response.json();
        if (data.success) {
          console.log("oui");
          setCard(data.card);
        } else {
          console.log("non");
          setError('Carte non trouvée');
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
  if (error) return <div>{error}</div>;
  if (!card) return <div>Aucune carte trouvée</div>;

  return (
    <div style={{ border: '1px solid gray', padding: '1rem', borderRadius: '8px', maxWidth: '300px' }}>
      <h2>{card.name}</h2>
      <p><strong>ID Pokédex :</strong> {card.idPokedex}</p>
      <p><strong>Quantité :</strong> {card.quantity}</p>
      {card.description && <p><strong>Description :</strong> {card.description}</p>}
      {card.image && <img src={card.image} alt={card.name} style={{ width: '100%' }} />}
      {/* Ajoute d'autres attributs si besoin */}
    </div>
  );
}