require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});
app.use(express.json());

const Card = require('./models/Cards');
const User = require('./models/User');
const Title = require('./models/Title');
const Badge = require('./models/Badge');
const ProfPic = require('./models/ProfPic');
const Message = require('./models/Message');

const auth = require('./middleware/auth');

// Probas GodPack
const slotGodPackWeights = [
  { rarity: 1, chances: 10 },
  { rarity: 2, chances: 32.5},
  { rarity: 3, chances: 42.5 },
  { rarity: 4, chances: 15 },
  { rarity: 5, chances: 0 },
];

// Probas Regular Pack
const slotCommonPackWeights = [
  { rarity: 1, chances: 0.1 },
  { rarity: 2, chances: 1 },
  { rarity: 3, chances: 12 },
  { rarity: 4, chances: 32.3 },
  { rarity: 5, chances: 54.6 },
];

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connecté'))
.catch(err => console.error('Erreur MongoDB :', err));

app.get('/', (req, res) => res.send('OK'));

// Schéma simple pour tester la connexion
const TestSchema = new mongoose.Schema({
  message: String,
});
const Test = mongoose.model('Test', TestSchema);

app.get('/test', async (req, res) => {
  try {
    let doc = await Test.findOne();
    if (!doc) {
      doc = await Test.create({ message: 'Hello depuis MongoDB !' });
    }
    res.json({ success: true, message: doc.message });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Route pour récupérer les infos d'une carte selon l'id
app.get('/cards/:id', async (req, res) => {
  const _id = parseInt(req.params._id, 10);
  try {
    const card = await Card.findOne({ _id: _id });
    if (card) {
      res.json({ success: true, card }); // On renvoie tout le document
    } else {
      res.status(404).json({ success: false, message: 'Carte non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/cards', async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Partie inscription
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    cleanUsername = username.replace(/[^a-zA-Z0-9_\-]/g, "");
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ cleanUsername, password: hashedPassword });
    res.json({ success: true, message: 'Utilisateur créé', user: { cleanUsername: user.username } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Partie connexion (bcp de chat GPT, pour la partie des tokens)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ success: false, message: 'Utilisateur non trouvé' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ success: false, message: 'Mot de passe incorrect' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, username: user.username });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Récupération de toutes les infos du compte
app.get('/users', async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ success: false, message: 'Token manquant' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // On récupère toutes les infos du profil sauf le mot de passe
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });

    res.json({ success: true, user });
  } catch (err) {
    console.error('Erreur de token :', err);
    res.status(401).json({ success: false, message: 'Token invalide' });
  }
});

// Suppression du compte utilisateur
app.delete('/users', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });

    await User.findByIdAndDelete(req.user.id);
    res.json({ success: true, message: 'Compte supprimé avec succès.' });
  } catch (err) {
    console.error('Erreur suppression :', err);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la suppression.' });
  }
});

// Récupération des infos publiques du compte
app.get('/users/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    }

    res.json({
      success: true,
      user: {
        username: user.username,
        title: user.title,
        ppURL: user.ppURL,
        badgeURL: user.badgeURL,
        stats: user.stats,
        cards: user.cards,
      }
    });
  } catch (err) {
    console.error('Erreur lors de la récupération du profil :', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Récupérer les photos de profil
app.get('/collectibles/profPic', async (req, res) => {
  const ids = (req.query.ids || '').split(',').filter(Boolean);
  let profPics;
  if (ids.length > 0) profPics = await ProfPic.find({ _id: { $in: ids } }).lean();
  else profPics = await ProfPic.find().lean();
  res.json({ success: true, profPics });
});

// Récupérer les titres
app.get('/collectibles/titles', async (req, res) => {
  const ids = (req.query.ids || '').split(',').filter(Boolean);
  let titles;
  if (ids.length > 0) titles = await Title.find({ _id: { $in: ids } }).lean();
  else titles = await Title.find().lean();
  res.json({ success: true, titles });
});

// Récupérer les badges
app.get('/collectibles/badges', async (req, res) => {
  const ids = (req.query.ids || '').split(',').filter(Boolean);
  let badges;
  if (ids.length > 0) badges = await Badge.find({ _id: { $in: ids } }).lean();
  else badges = await Badge.find().lean();
  res.json({ success: true, badges });
});

// Mettre à jour les modifications du profil d'un joueur
app.patch('/users/me/equip', auth, async (req, res) => {
  const { titleId, badgeIds, profPicId, featuredIds } = req.body;
  const user = await User.findById(req.user.id);

  // --- Gestion du titre ---
  if (titleId) {
    if (!user.collectibles.titleIds.includes(titleId))
      return res.status(400).json({ success: false, message: 'Titre non débloqué.' });
    user.titleEquipped = titleId;
  }

  // --- Gestion des badges ---
  if (badgeIds) {
    if (!badgeIds.every(id => id === 'default' || user.collectibles.badgeIds.includes(id))) 
      return res.status(400).json({ success: false, message: 'Badge non débloqué.' });
    user.badgesEquipped = badgeIds;
  }

  // --- Gestion de la photo de pofil ---
  if (profPicId) {
    if (!user.collectibles.profPicIds.includes(profPicId))
      return res.status(400).json({ success: false, message: 'Photo de profil non débloqué.' });
    user.profPicEquipped = profPicId;
  }

  // --- Gestion des cartes ---
  if (featuredIds) {
    if (!featuredIds.every(id => id == null || id == undefined || user.cards.some(c => c._id == id)))
      return res.status(400).json({ success: false, message: 'Carte non découverte.' });
    featuredIds.map(id => {if(id == null || id == undefined) id = 0});
    user.displayedCards = featuredIds;
  }

  // --- Sauvegarde unique ---
  await user.save();

  res.json({
    success: true,
    newTitleEquipped: user.titleEquipped,
    newBadgesEquipped: user.badgesEquipped,
    newProfPicEquipped: user.profPicEquipped,
    newDisplayedCards : user.displayedCards
  });
});

// Récupérer les amis d'un utilisateur
app.get('/users/friends/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    }

    // Récupère les profils complets des amis
    const friendsUsers = await User.find({
      username: { $in: user.friends }
    });

    // On simplifie les données envoyées
    const friends = friendsUsers.map(friend => ({
      username: friend.username,
      ppURL: friend.ppURL,
      badgeURL: friend.badgeURL,
      stats: friend.stats,
    }));

    res.json({ success: true, friends });

  } catch (err) {
    console.error('Erreur lors de la récupération du profil :', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Ouvrir un booster et ajouter les cartes au compte de l'utilisateur
app.post('/booster/open', async (req, res) => {
  const { username } = req.body;
  const boosterCost = 200;
  const boosterSize = 5;

  const pickWeighted = (weights) => {
    const total = weights.reduce((s, chances) => s + chances.chances, 0);
    let r = Math.random() * total;
    for (const { rarity, chances } of weights) {
      if ((r -= chances) < 0) return rarity;
    }
    return weights[weights.length - 1].rarity;
  }

  try {
    const boosterCards = [];
    const isGodPack = Math.random() > 0.999;
    for (let i = 0; i < boosterSize; i++) {
      let tries = 0;
      while (tries < 10) {
        let rarity = 0;
        if(isGodPack) {rarity = pickWeighted(slotGodPackWeights);}
        else {rarity = pickWeighted(slotCommonPackWeights);}
        const pool = await Card.aggregate([{ $match: { rarity } }, { $sample: { size: 1 } }]);
        if (pool.length) {
          boosterCards.push(pool[0]);
          break;
        }
        tries++;
      }
    }
    boosterCards.sort((a, b) => b.rarity - a.rarity);


    // --- Transaction Mongo ---
    const session = await mongoose.startSession();
    session.startTransaction();

    // Vérif + déduction diamants
    const user = await User.findOneAndUpdate(
      { username, diamonds: { $gte: boosterCost } },
      { $inc: { diamonds: -boosterCost } },
      { new: true, session }
    );
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Not enough diamonds" });
    }

    // Ajout / incrément des cartes
    let newCards = 0;
    let FACard = 0;
    for (const card of boosterCards) {
      const existing = user.cards.find(c => c._id == card._id);
      if(card.rarity == 1) {
        FACard++
        io.emit("newAlert", {
          type: "DROP",
          content: `<b>${username}</b>&nbsp;vient de pack&nbsp;<img src="img/rarities/rainbow.png"></img><b>${card.name}</b>`,
          createdAt: Date.now(),
          expiresAt: new Date(Date.now() + 24*60*60*1000),
        });
        await new Message({
          type: "DROP",
          content: `<b>${username}</b>&nbsp;vient de pack&nbsp;<img src="img/rarities/rainbow.png"></img><b>${card.name}</b>`,
          createdAt: Date.now(),
          expiresAt: new Date(Date.now() + 24*60*60*1000),
        }).save();
      };
      if (existing) {
        existing.quantity = parseInt(existing.quantity) + 1;
      } else {
        user.cards.push({ _id: card._id, quantity: 1 });
        newCards++;
      }
    }
    user.stats[0] += 5;
    user.stats[1] += 1;
    user.stats[2] += newCards;
    user.stats[4] += FACard;

    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    // --- Réponse complète ---
    res.json({
      success: true,
      booster: boosterCards,
      diamonds: user.diamonds,
      inventory: user.cards,
      isGodPack: isGodPack,
    });

  } catch (err) {
  console.error("Erreur /booster/open:", err);  // Affiche l'erreur complète dans la console serveur
  res.status(500).json({ success: false, error: err.message }); // Renvoie le message d'erreur au client
  }
});

// Envoyer des messages
app.post("/messages/send", async (req, res) => {
  const { type, content, duration } = req.body;

  try {
    const message = new Message({
      type,
      content,
      expiresAt: new Date(Date.now() + (duration || 24 * 60 * 60 * 1000)) // par défaut 24h
    });
    await message.save();
    res.json({ success: true, message });
  } catch (err) {
    console.error("Erreur /messages/send:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lire les messages
app.get("/messages/inbox", async (req, res) => {
  try {
    const messages = await Message.find({ expiresAt: { $gt: new Date() } })
      .sort({ createdAt: -1 })
      .populate("card"); // <-- récupère les infos de la carte
    res.json({ success: true, messages });
  } catch (err) {
    console.error("Erreur /messages/inbox:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


/* FIN DES ROUTES API */
/* DEBUT DU CANAL SOCKET.IO */

io.on("connection", (socket) => {
  console.log("Un client est connecté :", socket.id);

  // Écoute d'un événement 'sendMessage' depuis le client
  socket.on("sendMessage", (msg) => {
    console.log("Message reçu :", msg);

    // On renvoie le message à tous les clients connectés
    io.emit("newAlert", msg);
  });

  socket.on("disconnect", () => {
    console.log("Client déconnecté :", socket.id);
  });
});

// Supprimer automatiquement les messages expirés (toutes les heures)
setInterval(async () => {
  await Message.deleteMany({ expiresAt: { $lte: new Date() } });
}, 60 * 60 * 1000);


//!\ A garder à la fin du fichier /!\
app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// Démarrage serveur
server.listen(port, () => console.log("Serveur Socket.IO démarré sur port 3000"));