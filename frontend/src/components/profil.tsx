import { useEffect, useState } from 'react';
import SmartImage from './smartImage';
import CardDetails, {type Card} from '../components/card';

import { useConnection } from '../contexts/connectedContext'
import { usePage } from '../contexts/pageContext';
import { useUser, type User, type TitleWithEffect, type Badge, type ProfPicture } from '../contexts/userContext';
import { useApiSocket } from '../contexts/ApiSocketContext';

import './style/profil.css';

interface ProfileProps {
  username: string;
  isOwnProfile?: boolean;
}

export function ProfileDisplay() {
  const { user } = useUser();
  const { baseUrl } = useApiSocket();
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<ProfPicture | null>(null);

  useEffect(() => {
    const loadProfilePicture = async () => {
      try {
        let profPictureRes = await fetch( `${baseUrl}/collectibles/profPic?ids=${user?.profPicEquipped}`);
        let profPictureData = await profPictureRes.json();
        if(profPictureData.success) setSelectedProfilePicture(profPictureData.profPics[0] as ProfPicture || null);
      } catch (error) {
        console.log(error);
      }
    };

    if(user?.profPicEquipped) loadProfilePicture();    
  }, [user]);  
  
  if (!user) {
    return (
      <div id="profile_display">
        <div></div><h1>Déconnecté</h1>
      </div>
    )}
  else {
    return (
      <div id="profile_display">
        <SmartImage key={selectedProfilePicture?._id} src={`${import.meta.env.BASE_URL}img/profiles/${selectedProfilePicture?.image}.png`} alt="" fallbackSrc={`${import.meta.env.BASE_URL}img/icones/plus.png`} />
        <h1>{user.username}</h1>
      </div>
    )
  };
};

export function Profile({ username, isOwnProfile = false }: ProfileProps) {
  const { user } = useUser();
  const { activePage } = usePage();
  const { status } = useConnection();
  const { baseUrl, socket } = useApiSocket();

  const [allCards, setAllCards] = useState<Card[]>([])

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [featured, setFeatured] = useState<(Card | null)[]>([null, null, null, null]);

  const [selectedBadges, setSelectedBadges] = useState<Badge[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<TitleWithEffect | null>(null);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<ProfPicture | null>(null);

  const [ownedCards, setOwnedCards] = useState<Card[]>([]);
  const [ownedBadges, setOwnedBadges] = useState<Badge[]>([]);
  const [ownedTitles, setOwnedTitles] = useState<TitleWithEffect[]>([]);
  const [ownedProfilePictures, setOwnedProfilePictures] = useState<ProfPicture[]>([]);
  
  const [isEditingAllowed, setIsEditingAllowed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [pickerType, setPickerType] = useState<"profPic" | "title" | "badges" | "cards" | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  


  const statlist = ["Nombre de cartes", "Nombre de boosters ouvert", "Nombre de cartes uniques", "4", "Nombre de cartes FA", "6"]

  useEffect(() => {
    // Récupérer les cartes possédés
    if(user){
      const ownedIds = user.cards?.map(c => c._id) ?? [];
      const ownedCardsInit = allCards.filter((c: any) => ownedIds.includes(c._id));
      setOwnedCards(ownedCardsInit);
    }
  }, [allCards]);

  useEffect(() => {
    if(activePage != "account") {
      setIsDeleting(false);
      handleAnnulations
    }
  }, [activePage]);

  useEffect(() => {
    let cancelled = false;

    const loadProfileUser = async () => {
      try {
        // On fetch toutes les cartes du jeu
        const allRes = await fetch(`${baseUrl}/cards`);
        const allData = await allRes.json();
        //const allCards: any[] = Array.isArray(allData) ? allData : (allData.cards ?? []);
        setAllCards(Array.isArray(allData) ? allData : (allData.cards ?? []))

        if (isOwnProfile && user) {
          if (!cancelled) {
            setProfileUser(user);

            //featured cards (displayedCards -> on prend les cartes correspondantes)
            const displayedIds = user.displayedCards ?? [];
            const featuredCards = displayedIds.map((_id: string) => {
              if (_id == null) return null;
              return allCards.find((c: any) => c._id === _id) ?? null;
            });
            while (featuredCards.length < 4) { // toujours 4 emplacements (compléter avec null si besoin)
              featuredCards.push(null);
            }
            setFeatured(featuredCards);

            // Récupérer les cartes possédés
            const ownedIds = user.cards?.map(c => c._id) ?? [];
            const ownedCardsInit = allCards.filter((c: any) =>
              ownedIds.includes(c._id)
            );
            setOwnedCards(ownedCardsInit);

            // Récupérer le titres équipé
            if(user.titleEquipped == 'default') setSelectedTitle(null);
            else{
              let titlesRes = await fetch(`${baseUrl}/collectibles/titles?ids=${user.titleEquipped}`);
              let titlesData = await titlesRes.json();
              if(titlesData.success) setSelectedTitle(titlesData.titles[0] as TitleWithEffect);
            }

            // Récupérer les titres possédés
            if(user.collectibles?.titleIds.length < 1) setOwnedTitles([]);
            else {
              let titlesRes = await fetch(`${baseUrl}/collectibles/titles?ids=${user.collectibles?.titleIds.join(',')}`);
              let titlesData = await titlesRes.json();
              if(titlesData.success) setOwnedTitles(titlesData.titles as TitleWithEffect[] || []);
            }

            // Récupérer les badges équipés
            if(user.badgesEquipped.map(b => (b === 'default' ? '' : b)).filter(Boolean).join(',') == "") setSelectedBadges([{_id:'default', label:'default', image:'default'},{_id:'default', label:'default', image:'default'}]);
            else {
              let badgesRes = await fetch( `${baseUrl}/collectibles/badges?ids=${user.badgesEquipped.map(b => (b === 'default' ? '' : b)).filter(Boolean).join(',')}`);
              let badgesData = await badgesRes.json();
              if(badgesData.success) {
                while(badgesData.badges.length < 2) badgesData.badges.push({_id:'default', label:'default', image:'default'});
                setSelectedBadges(badgesData.badges as Badge[]);}
            }

            // Récupérer les badges possédés
            if (user.collectibles.badgeIds.length < 1) setOwnedBadges([]);
            else {
              let badgesRes = await fetch( `${baseUrl}/collectibles/badges?ids=${user.collectibles.badgeIds.join(',')}`);
              let badgesData = await badgesRes.json();
              if(badgesData.success) setOwnedBadges(badgesData.badges as Badge[] || []);
            }

            // Récupérer la photo de profil équipée
            if(user.profPicEquipped == 'default') setSelectedProfilePicture({_id:'default', label:'default', image:'default'});
            else {
              let profPictureRes = await fetch( `${baseUrl}/collectibles/profPic?ids=${user.profPicEquipped}`);
              let profPictureData = await profPictureRes.json();
              if(profPictureData.success) setSelectedProfilePicture(profPictureData.profPics[0] as ProfPicture || null);
            }

            // Récupérer les photos de profil possédées
            if (user.collectibles.profPicIds.length < 1) setOwnedProfilePictures([]);
            else {
              let profPictureRes = await fetch( `${baseUrl}/collectibles/profPic?ids=${user.collectibles.profPicIds.join(',')}`);
              let profPictureData = await profPictureRes.json();
              if(profPictureData.success) setOwnedProfilePictures(profPictureData.profPics as ProfPicture[]);
            }

      

            setIsEditingAllowed(true);
          }
        } else {
          // // Profil d’un autre utilisateur
          // const res = await fetch(`${baseUrl}/users/${username}`);
          // const data = await res.json();

          // if (!cancelled && data?.success && data.user) {
          //   const profile = data.user;
          //   setProfileUser(profile);

          //   // featured
          //   const displayedIds = profile.displayedCards ?? [];
          //   const featuredCards = allCards.filter((c: any) =>
          //     displayedIds.includes(c._id)
          //   );
          //   setFeatured(featuredCards);

          //   // ownedCards
          //   const ownedIds = profile.cards?.map((c: any) => c._id) ?? [];
          //   const ownedCards = allCards.filter((c: any) =>
          //     ownedIds.includes(c._id)
          //   );
          //   setOwnedCards(ownedCards);

          //   // collectibles
          //   setOwnedBadges(profile.collectibles.filter((c: any) => c.type === "badge"));
          //   setOwnedTitles(profile.collectibles.filter((c: any) => c.type === "title"));
          // }
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
      const response = await fetch(`${baseUrl}/users`, {
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

  const handleAnnulations = async () => {
    if(!user || !profileUser) return;
    const displayedIds = user.displayedCards || [];

    const featuredCards = displayedIds.map((_id: string) => {
      if (_id == null) return null;
      return allCards.find((c: any) => c._id === _id) ?? null;
    });
    while (featuredCards.length < 4) { // toujours 4 emplacements (compléter avec null si besoin)
      featuredCards.push(null);
    }
    setFeatured(featuredCards);

    // Récupérer le titres équipé
    if(user.titleEquipped == 'default') setSelectedTitle(null);
    else{
      let titlesRes = await fetch(`${baseUrl}/collectibles/titles?ids=${user.titleEquipped}`);
      let titlesData = await titlesRes.json();
      if(titlesData.success) setSelectedTitle(titlesData.titles[0] as TitleWithEffect);
    }

    // Récupérer les badges équipés
    if(user.badgesEquipped.map(b => (b === 'default' ? '' : b)).filter(Boolean).join(',') == "") setSelectedBadges([{_id:'default', label:'default', image:'default'},{_id:'default', label:'default', image:'default'}]);
    else {
      let badgesRes = await fetch( `${baseUrl}/collectibles/badges?ids=${user.badgesEquipped.map(b => (b === 'default' ? '' : b)).filter(Boolean).join(',')}`);
      let badgesData = await badgesRes.json();
      if(badgesData.success) {
        while(badgesData.badges.length < 2) badgesData.badges.push({_id:'default', label:'default', image:'default'});
        setSelectedBadges(badgesData.badges as Badge[]);}
    }

    // Récupérer la photo de profil équipée
    if(user.profPicEquipped == 'default') setSelectedProfilePicture({_id:'default', label:'default', image:'default'});
    else {
      let profPictureRes = await fetch( `${baseUrl}/collectibles/profPic?ids=${user.profPicEquipped}`);
      let profPictureData = await profPictureRes.json();
      if(profPictureData.success) setSelectedProfilePicture(profPictureData.profPics[0] as ProfPicture || null);
    }


    setIsEditing(false);
  }

  const handleModifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token manquant');
      return;
    }

    const response = await fetch(`${baseUrl}/users/me/equip`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        titleId: selectedTitle?._id,
        badgeIds: selectedBadges.map(b => b?._id),
        profPicId: selectedProfilePicture?._id,
        featuredIds: featured.map(c => c?._id)
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

const selectBadgeForSlot = (badge: Badge) => {
    if (selectedSlot == null) return;
    const next = [...selectedBadges];
    next[selectedSlot] = badge;
    setSelectedBadges(next);
    closePicker();
  }

  const selectTitle = (title: TitleWithEffect) => {
    if(title == null) return;
    setSelectedTitle(title);
    closePicker();
  }

  const selectProfPic = (profPic: ProfPicture) => {
    if (profPic == null) return;
    setSelectedProfilePicture(profPic);
    closePicker();
  }

  function getGradientStyle(gradientDirection: string, colors: string[]) {
    return {
      backgroundImage: `linear-gradient(${gradientDirection}, ${colors.join(', ')})`,
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
          <div id="pp-container" data-isediting={isEditing ? true : false} onClick={() => { if (isEditing) {setPickerType("profPic");openPickerForSlot(-1)} }} >
            {(selectedProfilePicture?.image != "default" || isEditing) ? (
              <SmartImage key={selectedProfilePicture?._id+"_A"} 
                src={`${import.meta.env.BASE_URL}img/profiles/${selectedProfilePicture?.image}.png`}
                alt=""
                fallbackSrc={`${import.meta.env.BASE_URL}img/icones/plus.png`}
              />
            ) : <SmartImage key={selectedProfilePicture?._id+"_B"} src={`${import.meta.env.BASE_URL}img/void.png`}/>}
          </div>
          <div id="username">
            <h1>{profileUser.username}</h1>
            <h2 key={-1} onClick={() => { if (isEditing) {setPickerType("title");openPickerForSlot(-1)} }} 
              style={selectedTitle?.isGradientActive ? getGradientStyle(selectedTitle?.gradientDirection ?? "to right", selectedTitle?.colors ?? ["black"]) : {}}
              data-isediting={isEditing}>
              {selectedTitle?.text || 'default'}
            </h2>
          </div>
          <div id="badges-display">
            {selectedBadges?.map((badge, i) => (
              <div key={i+""+badge._id} className="badge" data-isediting={isEditing ? true : false} onClick={() => {if(isEditing) {setPickerType("badges");openPickerForSlot(i)}}}>
                {(badge.image != "default" || isEditing) ? (
                  <SmartImage key={i+"2"+badge._id}
                    src={`${import.meta.env.BASE_URL}img/badges/${badge.image}.png`}
                    alt=""
                    fallbackSrc={`${import.meta.env.BASE_URL}img/icones/plus.png`}
                  />
                ) : <SmartImage key={i+"3"+badge._id} src={`${import.meta.env.BASE_URL}img/void.png`}/>}
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
                  <button className="account-button" onClick={handleAnnulations}>
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
              {card ? <CardDetails card={card} hoverEffects={true}/> : (
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
              <button id="picker-close-button" onClick={closePicker}>Fermer
                <img src={`${import.meta.env.BASE_URL}img/icones/retour.png`} alt='' />
              </button>
            </div>

            {pickerType == "cards" && (ownedCards.length == 0 || !ownedCards) ? (
                <div className="collectibles-error">
                  Vous ne possédez aucune carte à afficher.
                </div>
              ) : pickerType == "badges" && (ownedBadges?.length == 0 || !ownedBadges) ? (
                <div className="collectibles-error">
                  Vous ne possédez aucun badge à afficher.
                </div>
              ) : pickerType == "title" && (ownedTitles?.length == 0 || !ownedTitles) ? (
                <div className="collectibles-error">
                  Vous ne possédez aucun titre à afficher.
                </div>
              ) : pickerType == "profPic" && (ownedProfilePictures?.length == 0 || !ownedProfilePictures) ? (
                <div className="collectibles-error">
                  Vous ne possédez aucune photo de profil à afficher.
                </div>
              ) : ""}

            <div id="owned-collectibles-grid">
              {pickerType == "cards" ? ownedCards.map((card) => (
                <button key={card._id} onClick={() => selectCardForSlot(card)}>
                  <CardDetails card={card}/>
                </button>
              )) : pickerType == "badges" ? ownedBadges?.map((badge, index) => (
                <button className="badge_selection" key={index} onClick={() => selectBadgeForSlot(badge)}>
                  {badge.image == 'default' ? (
                  <SmartImage id="default_badge" src={`${import.meta.env.BASE_URL}img/icones/plus.png`}></SmartImage>
                  ) : (
                  <SmartImage 
                    src={`${import.meta.env.BASE_URL}img/badges/${badge.image}.png`}
                    fallbackSrc={`${import.meta.env.BASE_URL}img/void.png`}>
                  </SmartImage>)}
                  <p>{badge.label}</p>
                </button>
              )) : pickerType == "title" ? ownedTitles?.map((title) => (
                <button className="titre_selection" key={title.text} onClick={() => selectTitle(title)}>
                  {title.text == '' ? (
                    <p style={getGradientStyle("to right", ["black"])}>Aucun</p>
                  ) : (
                    <p style={getGradientStyle(title.gradientDirection ?? "to right", title.colors ?? ["black"])}>{title.text}</p>
                  )}
                </button>
              )) : pickerType == "profPic" ? ownedProfilePictures?.map((profPic) => (
                <button className="profPic_selection" key={profPic.label} onClick={() => selectProfPic(profPic)}>
                  {profPic.image == 'default' ? (
                  <SmartImage id="default_profPic" src={`${import.meta.env.BASE_URL}img/icones/plus.png`}></SmartImage>
                  ) : (
                  <SmartImage 
                    src={`${import.meta.env.BASE_URL}img/profiles/${profPic.image}.png`}
                    fallbackSrc={`${import.meta.env.BASE_URL}img/void.png`}>
                  </SmartImage>)}
                  <p>{profPic.label}</p>
                </button>
              )) : ""}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}