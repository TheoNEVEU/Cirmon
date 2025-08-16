import { useEffect, useState } from 'react';
import SmartImage from './smartImage';
import CardDetails, { type Card } from '../components/card';

import { useUser, type User } from '../contexts/userContext';

import './style/profil.css';

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

interface ProfileProps {
  username: string;
  isOwnProfile?: boolean;
}

export default function Profile({ username, isOwnProfile = false }: ProfileProps) {
  const { user } = useUser();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);
  const [ownedBadges, setOwnedBadges] = useState<Badge[]>([]);
  const [ownedTitles, setOwnedTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);

  const [featured, setFeatured] = useState<(number | null)[]>([null, null, null, null]);
  
  const [isEditingAllowed, setIsEditingAllowed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [pickerType, setPickerType] = useState<"title" | "badges" | "cards" | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const statlist = ["Nombre de cartes", "Nombre de boosters ouvert", "Nombre de cartes uniques", "4", "Nombre de cartes FA", "6"];

  // ---- 1) Charger le user affiché (moi via contexte, sinon GET public) ----
  useEffect(() => {
    let cancelled = false;

    const loadProfileUser = async () => {
      setLoading(true);
      try {
        if (isOwnProfile && user) {
          // ✅ on utilise le user global
          if (!cancelled) {
            setProfileUser(user as unknown as User);
            setFeatured((user as any)?.featuredCards ?? [null, null, null, null]);
            setIsEditingAllowed(true);

            // Ici on récupère les données de l'utilisateur (badges/titres/cartes)
            setOwnedCards((user as any).cards ?? []);
            setOwnedBadges((user as any).badges ?? []);
            setOwnedTitles((user as any).titles ?? []);
          }
        } else {
          // TODO: cas d’un autre utilisateur (profil public)
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

  // ---- Pickers ----
  const openPickerForSlot = (slotIndex: number, type: "cards" | "badges" | "title") => {
    if (!isEditingAllowed) return;
    setSelectedSlot(slotIndex);
    setPickerType(type);
    setPickerOpen(true);
  };

  const closePicker = () => {
    setPickerOpen(false);
    setSelectedSlot(null);
    setPickerType(null);
  };

  const selectItemForSlot = (item: any) => {
    // à compléter selon la logique (card vs badge vs title)
    console.log("Sélectionné :", pickerType, item);
    closePicker();
  };

  if (loading || !profileUser) {
    return <p>Chargement du profil...</p>;
  }

  const equippedTitle = profileUser.collectibles.find(
    (c) => c.type === "title" && c.equipped
  );

  const equippedBadges = profileUser.collectibles.filter(
    (c) => c.type === "badge" && c.equipped
  );

  return (
    <div id="account-grid" className="page-container" data-isediting={isEditing}>
      <div id="profil-infos" >
        <div id="profilpartA">
          <div id="pp-container">
            <SmartImage
              data-isediting={isEditing ? true : false}
              src={`${import.meta.env.BASE_URL}img/profiles/${profileUser.ppURL}.png`}
              alt=""
              fallbackSrc={`${import.meta.env.BASE_URL}img/icones/plus.png`}
            />
          </div>
          <div id="username">
            <h1>{profileUser.username}</h1>
            <h2
              onClick={() => { if (isEditing) openPickerForSlot(0, "title"); }}
              data-isediting={isEditing}
            >
              {equippedTitle?.name ?? ''}
            </h2>
          </div>
          <div id="badges-display">
            {equippedBadges?.map((badge, i) => (
              <div key={i} className="badge" onClick={() => { if (isEditing) openPickerForSlot(i, "badges"); }}>
                <SmartImage
                  src={`${import.meta.env.BASE_URL}img/badges/${badge.name}`}
                  alt={badge.name}
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
      </div>

      {/* ---- Cartes exposées ---- */}
      <div id="profil-cards">
        {featured.map((id, idx) => {
          const card = id != null ? ownedCards.find((c) => c.idPokedex === id) : null;
          return (
            <div key={idx} className="displayedCard-slot">
              {card ? (
                <CardDetails card={card as any} />
              ) : (
                <div
                  className="emptyDisplayedCard-slot"
                  onClick={() => { if (isOwnProfile) openPickerForSlot(idx, "cards"); }}
                >
                  <span>+</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ---- Picker ---- */}
      {pickerOpen && (
        <div id="picker-backdrop" onClick={closePicker}>
          <div id="picker-panel" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3>Choisis un {pickerType}</h3>
              <button onClick={closePicker}>Fermer</button>
            </div>

            <div className="owned-collectibles-grid">
              {pickerType === "cards" && ownedCards.map((card) => (
                <button key={card.idPokedex} onClick={() => selectItemForSlot(card)}>
                  <CardDetails card={card} />
                </button>
              ))}

              {pickerType === "badges" && ownedBadges.map((badge) => (
                <button key={badge.idBadge} onClick={() => selectItemForSlot(badge)}>
                  <img src={badge.imageUrl} alt={badge.name} />
                  {badge.name}
                </button>
              ))}

              {pickerType === "title" && ownedTitles.map((title) => (
                <button key={title.idTitle} onClick={() => selectItemForSlot(title)}>
                  {title.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
