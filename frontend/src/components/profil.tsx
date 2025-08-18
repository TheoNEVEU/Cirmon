import { useEffect, useState } from 'react';
import SmartImage from './smartImage';
import CardDetails, {type Card} from '../components/card';

import { useConnection } from '../contexts/connectedContext'
import { useUser, type User, type TitleWithEffect } from '../contexts/userContext';

import './style/profil.css';

interface ProfileProps {
  username: string;
  isOwnProfile?: boolean;
}

export default function Profile({ username, isOwnProfile = false }: ProfileProps) {
  const { user } = useUser();
  const { status } = useConnection();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [featured, setFeatured] = useState<(Card | null)[]>([null, null, null, null]);
  const [selectedBadges, setSelectedBadges] = useState<String[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<TitleWithEffect | null>(null);
  
  const [isEditingAllowed, setIsEditingAllowed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [pickerType, setPickerType] = useState<"title" | "badges" | "cards" | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);
  const [ownedBadges, setOwnedBadges] = useState<String[]>([]);
  const [ownedTitles, setOwnedTitles] = useState<TitleWithEffect[]>([]);


  const statlist = ["Nombre de cartes", "Nombre de boosters ouvert", "Nombre de cartes uniques", "4", "Nombre de cartes FA", "6"]

  useEffect(() => {
    let cancelled = false;

    const loadProfileUser = async () => {
      try {
        // On fetch toutes les cartes du jeu
        const allRes = await fetch("https://testcirmon.onrender.com/cards");
        const allData = await allRes.json();
        const allCards: any[] = Array.isArray(allData) ? allData : (allData.cards ?? []);

        if (isOwnProfile && user) {
          if (!cancelled) {
            setProfileUser(user);

            //featured cards (displayedCards -> on prend les cartes correspondantes)
            const displayedIds = user.displayedCards ?? [];

            const featuredCards = displayedIds.map((idPokedex: number) => {
              if (idPokedex == null) return null;
              return allCards.find((c: any) => c.idPokedex === idPokedex) ?? null;
            });
            while (featuredCards.length < 4) { // toujours 4 emplacements (compléter avec null si besoin)
              featuredCards.push(null);
            }

            setFeatured(featuredCards);
            setSelectedBadges(user.badgesEquipped);
            setSelectedTitle(user.title);

            console.log(selectedBadges);
            console.log(user.badgesEquipped);

            // Récupérer les cartes possédés
            const ownedIds = user.cards?.map(c => c.idPokedex) ?? [];
            const ownedCardsInit = allCards.filter((c: any) =>
              ownedIds.includes(c.idPokedex)
            );
            setOwnedCards(ownedCardsInit);

            // Récupérer les titres possédés
            const titlesRes = await fetch(`https://testcirmon.onrender.com/collectibles/titles?ids=${user.collectibles?.titleIds.join(',')}`);
            const titlesData = await titlesRes.json();
            setOwnedTitles(titlesData.titles || []);
            console.log(ownedBadges);


            // Récupérer les badges possédés
            const badgesRes = await fetch( `https://testcirmon.onrender.com/collectibles/badges?ids=${user.collectibles.badgeIds.join(',')}`);
            const badgesData = await badgesRes.json();
            setOwnedBadges(badgesData.badges);

            //On peut forcer des valeurs pour le moment pour les tests
            //setOwnedBadges(["Dark", "Fire", "Psy", "Water", "Fight", "Electric", "Normal", "Grass"])
            //setOwnedTitles([{_id:"", text: "caca",gradientDirection: "to right",colors: ['brown, red'],isGradientActive: true},{_id:"", text: "boudin",gradientDirection: "to top",colors: ['brown, black'],isGradientActive: true}])

            setIsEditingAllowed(true);
          }
        } else {
          // Profil d’un autre utilisateur
          const res = await fetch(`https://testcirmon.onrender.com/users/${username}`);
          const data = await res.json();

          if (!cancelled && data?.success && data.user) {
            const profile = data.user;
            setProfileUser(profile);

            // featured
            const displayedIds = profile.displayedCards ?? [];
            const featuredCards = allCards.filter((c: any) =>
              displayedIds.includes(c.idPokedex)
            );
            setFeatured(featuredCards);

            // ownedCards
            const ownedIds = profile.cards?.map((c: any) => c.idPokedex) ?? [];
            const ownedCards = allCards.filter((c: any) =>
              ownedIds.includes(c.idPokedex)
            );
            setOwnedCards(ownedCards);

            // collectibles
            setOwnedBadges(profile.collectibles.filter((c: any) => c.type === "badge"));
            setOwnedTitles(profile.collectibles.filter((c: any) => c.type === "title"));
          }
        }
      } catch (e) {
        console.error("Erreur chargement profil :", e);
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

  const handleModifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token manquant');
      return;
    }

    const response = await fetch('https://testcirmon.onrender.com/users/me/equip', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        titleId: selectedTitle?._id,
        badgeIds: selectedBadges
      })
    });

    if (response.ok) {
      const data = await response.json();
      setProfileUser(prev => ({
        ...(prev as User),
        title: data.title,
        badgesEquipped: data.badgesEquipped
      }));
      setIsEditing(false);
    } else {
      const error = await response.json();
      console.error('Erreur:', error.message);
    }
  };

  const openPickerForSlot = (slotIndex: number) => {
    if (!isEditingAllowed) return;
    setSelectedSlot(slotIndex);
    setPickerOpen(true);
  };

  const closePicker = () => {
    setPickerOpen(false);
    setSelectedSlot(null);
  };

  const selectCardForSlot = (card: Card) => {
    if (selectedSlot == null) return;
    const next = [...featured];
    next[selectedSlot] = card;
    setFeatured(next);
    closePicker();
  };

  const selectBadgeForSlot = (badge: string) => {
    if (selectedSlot == null) return;
    const next = profileUser as User;
    next.badgesEquipped[selectedSlot] = badge;
    setProfileUser(next);
    console.log(profileUser?.badgesEquipped)
    closePicker();
  }

  const selectTitle = (title: TitleWithEffect) => {
    if(title == null) return;
    const next = profileUser as User;
    next.title = title;
    setSelectedTitle(title);
    setProfileUser(next);
    closePicker();
  }

  function getGradientStyle(gradientDirection: string, colors: string[]) {
    return {
      backgroundImage: `linear-gradient(${gradientDirection}, ${colors.join(', ')})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      color: 'transparent',
      width: 'fit-content',
      paddingLeft: '3%',
      fontSize: '100%',
      fontWeight: 'bold'
    };
  }

  if (!(status=='connected')) {
    return (
      <div id="page-container-loading">
        <img className="loadingImg"  src="img/loading.png" alt="car"/>
        <h2>Connexion à la base de données...</h2>
      </div>
    );
  }
  if (!profileUser) {
    return (
      <div id="page-container-loading">
        <img className="loadingImg"  src="img/loading.png" alt="car"/>
        <h2>Chargement du profil...</h2>
      </div>
    );
  }
  return (
    <div id="account-grid" className="page-container" data-isediting={isEditing}>
      <div id="profil-infos" >
        <div id="profilpartA">
          <div id="pp-container">
            {(profileUser.ppURL != "NoPP" || isEditing) && 
              <SmartImage data-isediting={isEditing ? true : false}
              src={`${import.meta.env.BASE_URL}img/profiles/${profileUser.ppURL}.png`}
              alt=""
              fallbackSrc={`${import.meta.env.BASE_URL}img/icones/plus.png`}
            />}
            {!(profileUser.ppURL != "NoPP" || isEditing) && 
              <SmartImage style={{opacity: 0}} src={`${import.meta.env.BASE_URL}img/void.png`}/>}
          </div>
          <div id="username">
            <h1>{profileUser.username}</h1>
            <h2 key={-1} onClick={() => { if (isEditing) {setPickerType("title");openPickerForSlot(-1)} }} 
              style={profileUser.title?.isGradientActive ? getGradientStyle(profileUser.title?.gradientDirection ?? "to right", profileUser?.title.colors ?? ["black"]) : {}}
              data-isediting={isEditing}>
              {profileUser.title?.text || 'default'}
            </h2>
          </div>
          <div id="badges-display">
            {profileUser.badgesEquipped?.map((badge, i) => (
              <div key={i+""+badge} className="badge" onClick={() => {if(isEditing) {setPickerType("badges");openPickerForSlot(i)}}}>
                {(badge != "default" || isEditing) && 
                <SmartImage
                  src={`${import.meta.env.BASE_URL}img/badges/${badge}.png`}
                  alt=""
                  fallbackSrc={`${import.meta.env.BASE_URL}img/icones/plus.png`}
                />}
                {!(badge != "default" || isEditing) && 
              <SmartImage style={{opacity: 0}} src={`${import.meta.env.BASE_URL}img/void.png`}/>}
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
                  <button className="account-button" id="valid" onClick={handleModifications}>
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
        {featured.map((card, id) => {
          return (
            <div key={id} className="displayedCard-slot" onClick={() => {if(isOwnProfile && isEditing) {setPickerType('cards');openPickerForSlot(id);}}}>
              {card ? <CardDetails card={card} /> : (
                <div className="emptyDisplayedCard-slot">
                  <span>{isEditing ? "+" : ""}</span>
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
              <h3>Choisir un{
                  pickerType == "cards" ? "e carte" :
                  pickerType == "badges" ? " badge" : 
                  pickerType == "title" ? " titre" : 
                  " objet"} à exposer</h3>
              <button onClick={closePicker}>Fermer</button>
            </div>

            <div id="owned-collectibles-grid">
              {pickerType == "cards" ? ownedCards.map((card) => (
                <button key={card.idPokedex} onClick={() => selectCardForSlot(card)}>
                  <CardDetails card={card}/>
                </button>
              )) : pickerType == "badges" ? ownedBadges?.map((badge, index) => (
                <button key={index} onClick={() => selectBadgeForSlot(badge as string)}>
                  <SmartImage src={`${import.meta.env.BASE_URL}img/badges/${badge}.png`}></SmartImage><br></br>{badge}
                </button>
              )) : pickerType == "title" ? ownedTitles?.map((title) => (
                <button key={title.text} onClick={() => selectTitle(title)}>
                  <p style={getGradientStyle(title.gradientDirection ?? "to right", title.colors ?? ["black"])}>
                    {title.text || 'default'}
                  </p>
                </button>
              )) : ""}

              {pickerType == "cards" && (ownedCards.length == 0 || !ownedCards) ? (
                  <div style={{ padding: 24, textAlign: 'center', color: '#666' }}>
                    Aucune carte à afficher.
                  </div>
                ) : pickerType == "badges" && (ownedBadges?.length == 0 || !ownedBadges) ? (
                  <div style={{ padding: 24, textAlign: 'center', color: '#666' }}>
                    Aucun badge à afficher.
                  </div>
                ) : pickerType == "title" && (ownedTitles?.length == 0 || !ownedTitles) ? (
                  <div style={{ padding: 24, textAlign: 'center', color: '#666' }}>
                    Aucun titre à afficher.
                  </div>
                ) : ""}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}