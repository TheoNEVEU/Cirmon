require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const Card = require('./models/Cards');
const User = require('./models/User');
const Title = require('.models/Title');
const Badge = require('.models/Badge');

app.use(express.json());  // Important pour POST /register et POST /login
app.use(cors());

const rarityChances = [
  { rarity: 1, chance: 0.002 },
  { rarity: 2, chance: 0.01 },
  { rarity: 3, chance: 0.10 },
  { rarity: 4, chance: 0.30 },
  { rarity: 5, chance: 0.60 },
];

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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

// Route pour récupérer les infos d'une carte selon l'idPokedex
app.get('/cards/:idPokedex', async (req, res) => {
  const idPokedex = parseInt(req.params.idPokedex, 10);
  try {
    const card = await Card.findOne({ idPokedex: idPokedex });
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    res.json({ success: true, message: 'Utilisateur créé', user: { username: user.username } });
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

// Récupérer les titres possédés par un joueur
app.get('/collectibles/titles', async (req, res) => {
  const ids = (req.query.ids || '').split(',').filter(Boolean);
  const titles = await Title.find({ _id: { $in: ids } }).lean();
  res.json({ success: true, titles });
});

// Récupérer les badges possédés par un joueur
app.get('/collectibles/badges', async (req, res) => {
  const ids = (req.query.ids || '').split(',').filter(Boolean);
  const badges = await Badge.find({ _id: { $in: ids } }).lean();
  res.json({ success: true, badges });
});

// PATCH /users/me/equip
app.patch('/users/me/equip', auth, async (req, res) => {
  const { titleId, badgeIds } = req.body;
  const user = await User.findById(req.user.id);

  // --- Gestion du titre ---
  if (titleId) {
    if (!user.collectibles.titleIds.includes(titleId)) return res.status(400).json({ success: false, message: 'Titre non débloqué.' });
    const t = await Title.findById(titleId).lean();
    if (!t) return res.status(404).json({ success: false, message: 'Titre introuvable.' });
    user.title = {
      text: t.text,
      gradientDirection: t.gradientDirection,
      colors: t.colors,
      isGradientActive: t.isGradientActive
    };
  }

  // --- Gestion des badges ---
  if (badgeIds) {
    const ownsAll = badgeIds.every(id => user.collectibles.badgeIds.includes(id));
    if (!ownsAll) return res.status(400).json({ success: false, message: 'Badge non débloqué.' });
    user.badgesEquipped = badgeIds.slice(0, 2); // limite à 2 badges
  }

  // --- Sauvegarde unique ---
  await user.save();

  res.json({
    success: true,
    title: user.title,
    badgesEquipped: user.badgesEquipped
  });
});



// récupère les amis d'un utilisateur
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

// Suppression du compte utilisateur
app.delete('/users', async (req, res) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) return res.status(401).json({ success: false, message: 'Token manquant' });
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    await User.findByIdAndDelete(decoded.userId);

    res.json({ success: true, message: 'Compte supprimé avec succès.' });
  } catch (err) {
    console.error('Erreur de token ou suppression :', err);
    res.status(401).json({ success: false, message: 'Token invalide ou suppression impossible.' });
  }
});

// Exemple dans Express
app.get('/booster', async (req, res) => {
  const boosterSize = 5;

  const pickRarity = () => {
    const rand = Math.random();
    let sum = 0;
    for (let i = rarityChances.length - 1; i >= 0; i--) {
      sum += rarityChances[i].chance;
      if (rand <= sum) return rarityChances[i].rarity;
    }
    return 5;
  };

  const boosterCards = [];
  const usedIds = new Set();

  try {
    for (let i = 0; i < boosterSize; i++) {
      let tries = 0;
      let card = null;

      while (tries < 10) {
        const rarity = pickRarity();
        const pool = await Card.aggregate([
          { $match: { rarity } },
          { $sample: { size: 1 } }
        ]);

        if (pool.length > 0 && !usedIds.has(pool[0]._id.toString())) {
          card = pool[0];
          usedIds.add(card._id.toString());
          boosterCards.push(card);
          break;
        }

        tries++;
      }
    }

    res.json({ success: true, booster: boosterCards });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/booster/open', async (req, res) => {
  const { username } = req.body;
  const boosterCost = 200;
  const boosterSize = 5;

  try {
    // --- Tirage des cartes ---

    const pickRarity = () => {
      let rand = Math.random(), sum = 0;
      for (let i = rarityChances.length - 1; i >= 0; i--) {
        sum += rarityChances[i].chance;
        if (rand <= sum) return rarityChances[i].rarity;
      }
      return 5;
    };

    const boosterCards = [];
    const usedIds = new Set();
    for (let i = 0; i < boosterSize; i++) {
      let tries = 0;
      while (tries < 10) {
        const rarity = pickRarity();
        const pool = await Card.aggregate([{ $match: { rarity } }, { $sample: { size: 1 } }]);
        if (pool.length /*&& !usedIds.has(pool[0]._id.toString())*/) {
          boosterCards.push(pool[0]);
          usedIds.add(pool[0]._id.toString());
          break;
        }
        tries++;
      }
    }

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
      const existing = user.cards.find(c => c.idPokedex == card.idPokedex);
      if(card.rarity == 1) FACard++;
      if (existing) {
        existing.quantity = parseInt(existing.quantity) + 1;
      } else {
        user.cards.push({ idPokedex: card.idPokedex, quantity: 1 });
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
      inventory: user.cards
    });

  } catch (err) {
  console.error("Erreur /booster/open:", err);  // Affiche l'erreur complète dans la console serveur
  res.status(500).json({ success: false, error: err.message }); // Renvoie le message d'erreur au client
  }
});


// A garder à la fin du fichier !
app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// Démarrage serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
