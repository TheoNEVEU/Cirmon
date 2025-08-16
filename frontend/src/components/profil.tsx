import { useEffect, useState } from 'react';
import SmartImage from './smartImage';
import CardDetails, {type Card} from '../components/card';

import { useUser, type User } from '../contexts/userContext';

import './style/profil.css';

type TitleWithEffect = {
  text: string;
  gradientDirection: string;
  colors: string[];
  isGradientActive: boolean;
};

type UserCardRef = { idPokedex: number; quantity: number };

interface ProfileProps {
  username: string;
  isOwnProfile?: boolean;
}

type Title = {
  idTitle: string;
  text: string;
  gradientDirection?: string;
  colors?: string[];
  isGradientActive?: boolean;
};

type Badge = {
  idBadge: string;
  name: string;
  imageUrl: string;
};

export default function Profile({ username, isOwnProfile = false }: ProfileProps) {
  const { user } = useUser();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState<(number | null)[]>([null, null, null, null]);
  
  const [isEditingAllowed, setIsEditingAllowed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [pickerType, setPickerType] = useState<"title" | "badges" | "cards" | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);
  const [ownedBadges, setOwnedBadges] = useState<Badge[]>([]);
  const [ownedTitles, setOwnedTitles] = useState<Title[]>([]);


  const statlist = ["Nombre de cartes", "Nombre de boosters ouvert", "Nombre de cartes uniques", "4", "Nombre de cartes FA", "6"]

  // ---- 1) Charger le user affiché (moi via contexte, sinon GET public) ----
  useEffect(() => {
    let cancelled = false;

    const loadProfileUser = async () => {
      setLoading(true);
      try {
        if (isOwnProfile && user) {
          // On utilise le user global pour éviter un fetch inutile
          if (!cancelled) {
            setProfileUser(user as unknown as User);
            setFeatured((user as any)?.featuredCards ?? [null, null, null, null]);
            setIsEditingAllowed(true);

            setOwnedCards((user as any).cards ?? []);
            setOwnedBadges((user as any).badges ?? []);
            setOwnedTitles((user as any).titles ?? []);
          }
        } else {
          // On charge le profil public d’un autre utilisateur
          const res = await fetch(`https://testcirmon.onrender.com/users/${username}`);
          const data = await res.json();
          if (!cancelled && data?.success && data.user) {
            setProfileUser(data.user as User);
            setFeatured(data.user.featuredCards ?? [null, null, null, null]);
          }
        }
      } catch (e) {
        console.error('Erreur chargement profil :', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfileUser();
    return () => {
      cancelled = true;
    };
  }, [isOwnProfile, username, user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      const response = await fetch('https://testcirmon.onrender.com/users', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        localStorage.removeItem('token');
        window.location.reload();
      } else {
        console.error('Erreur lors de la suppression du compte');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  };

  const openPickerForSlot = (slotIndex: number) => {
    if (!isEditingAllowed) return;
    setSelectedSlot(slotIndex);
    setPickerType('cards');
    console.log(ownedCards)
    setPickerOpen(true);
  };

  const closePicker = () => {
    setPickerOpen(false);
    setSelectedSlot(null);
  };

  const selectCardForSlot = (card: Card) => {
    if (selectedSlot == null) return;
    const next = [...featured];
    next[selectedSlot] = card.idPokedex;
    setFeatured(next);
    closePicker();
  };

  const gradientStyle = {
      background: `linear-gradient(${/*direction*/'right'}, ${/*colors.join(', ')*/'red, green'})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      color: 'transparent',
      width: 'fit-content',
      paddingLeft: '3%',
      fontSize: '100%'
  };

  const equippedTitle = profileUser?.collectibles.find(
    (c) => c.type === "title" && c.equipped
  );

  const equippedBadges = profileUser?.collectibles.filter(
    (c) => c.type === "badge" && c.equipped
  );


  if (loading || !profileUser) {
    return <p>Chargement du profil...</p>;
  }

  return (
    <div id="account-grid" className="page-container" data-isediting={isEditing}>
      <div id="profil-infos" >
        <div id="profilpartA">
          <div id="pp-container">
            <SmartImage data-isediting={isEditing ? true : false}
              src={`${import.meta.env.BASE_URL}img/profiles/${profileUser.ppURL}.png`}
              alt=""
              fallbackSrc={`${import.meta.env.BASE_URL}img/icones/plus.png`}
            />
          </div>
          <div id="username">
            <h1>{profileUser.username}</h1>
            <h2 onClick={() => {if(isEditing) setPickerType("title")}} /*style={profileUser.title.isGradientActive ? gradientStyle : {}}*/ data-isediting={isEditing}> {equippedTitle?.name ?? 'default'} </h2>
          </div>
          <div id="badges-display">
            {equippedBadges?.map((badge, i) => (
              <div key={i} className="badge" onClick={() => {if(isEditing) setPickerType("badges")}}>
                <SmartImage
                  src={`${import.meta.env.BASE_URL}img/badges/${badge.name}.png`}
                  alt=""
                  fallbackSrc={`${import.meta.env.BASE_URL}img/icones/plus.png`}
                />
              </div>
            ))}
          </div>
        </div>

        <div id="profilpartB">
          {profileUser.stats.map((stat, index) => (
            <div key={index} className='single-stat'> {statlist[index]} : {stat}</div>
          ))}
        </div>

        <div id="profilpartC">
          {isOwnProfile && (
            <>
              {isDeleting ? (
                // Affichage de confirmation suppression
                <>
                  <button className="account-button" onClick={() => setIsDeleting(false)}>
                    <img src={`${import.meta.env.BASE_URL}img/icones/retour.png`} alt='' /> Annuler
                  </button>
                  <button className="account-button" id="delete" onClick={handleDelete}>
                    <img src={`${import.meta.env.BASE_URL}img/icones/delete.png`} alt='' /> Supprimer
                  </button>
                  <p>Supprimer le compte ?</p>
                </>
              ) : isEditing ? (
                <>
                  <button className="account-button" onClick={() => setIsEditing(false)}>
                    <img src={`${import.meta.env.BASE_URL}img/icones/retour.png`} alt='' /> Annuler
                  </button>
                  <button className="account-button" id="valid" onClick={handleDelete}>
                    <img src={`${import.meta.env.BASE_URL}img/icones/check.png`} alt='' /> Valider
                  </button>
                  <p>Enregistrer les modifications ?</p>
                </>
              ) : (
                // Affichage des boutons standards
                <>
                  <button id="delete" className="account-button" onClick={() => setIsDeleting(true)}>
                    <img src={`${import.meta.env.BASE_URL}img/icones/delete.png`} alt='' /> Supprimer
                  </button>
                  <button className="account-button" onClick={handleLogout}>
                    <img src={`${import.meta.env.BASE_URL}img/icones/logout.png`} alt='' /> Déconnexion
                  </button>
                  <button className="account-button" onClick={() => setIsEditing(true)}>
                    <img src={`${import.meta.env.BASE_URL}img/icones/edit.png`} alt='' /> Modifier
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div id="profil-cards">
        {featured.map((id, idx) => {
          const card = id != null ? ownedCards.find((c) => c.idPokedex === id) : null;
          return (
            <div key={idx} className="displayedCard-slot">
              {card ? <CardDetails card={card as any}/> : (
                <div key={id} className="emptyDisplayedCard-slot" onClick={() => {if(isOwnProfile) openPickerForSlot(idx); console.log('ok');}}>
                  <span>+</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {pickerOpen && (
        <div id="picker-backdrop" onClick={closePicker}>
          <div id="picker-panel" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3>Choisis une carte à exposer</h3>
              <button onClick={closePicker}>Fermer</button>
            </div>

            <div className="owned-collectibles-grid">
              {pickerType == "cards" ? ownedCards.map((card) => (
                <button key={card.idPokedex} onClick={() => selectCardForSlot(card)}>
                  <CardDetails card={card}/>
                </button>
              )) : pickerType == "badges" ? ownedBadges.map((badge) => (
                <button key={badge.name} onClick={() => selectCardForSlot(badge)}>
                  {badge.name}
                </button>
              )) : pickerType == "title" ? ownedTitles.map((title) => (
                <button key={title.text} onClick={() => selectCardForSlot(title)}>
                  {title.text}
                </button>
              )) : ""}

              {ownedCards.length === 0 && (
                <div style={{ padding: 24, textAlign: 'center', color: '#666' }}>
                  Aucune carte possédée à afficher.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}