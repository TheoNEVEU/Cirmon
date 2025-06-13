require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const Card = require('./models/Cards');
const Profile = require('./models/User');

app.use(express.json());  // Important pour POST /register et POST /login
app.use(cors());


// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connecté'))
.catch(err => console.error('Erreur MongoDB :', err));

// Schéma simple pour tester la connexion
const TestSchema = new mongoose.Schema({
  message: String,
});

const Test = mongoose.model('Test', TestSchema);

// Route test : récupère ou crée un document test
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
  console.log('GET /cards appelé');  // <== ajoute cette ligne pour debug
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// Partie inscription
app.post('/register', async (req, res) => {
  console.log('POST /register appelé');
  console.log('Données reçues pour inscription :', req.body);
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Profile.create({ username, password: hashedPassword });
    res.json({ success: true, message: 'Utilisateur créé', user: { username: user.username } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Partie connexion (bcp de chat GPT, pour la partie des tokens)
app.post('/login', async (req, res) => {
  console.log('POST /login appelé');
  const { username, password } = req.body;
  try {
    const user = await Profile.findOne({ username });
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
  console.log('GET /profile appelé');
  const authHeader = req.headers['authorization'];

  if (!authHeader) return res.status(401).json({ success: false, message: 'Token manquant' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // On récupère toutes les infos du profil sauf le mot de passe
    const user = await Profile.findById(decoded.userId).select('-password');

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
    const user = await Profile.findOne({ username });

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

// Suppression du compte utilisateur
app.delete('/users', async (req, res) => {
  console.log('DELETE /users appelé');
  const authHeader = req.headers['authorization'];

  if (!authHeader) return res.status(401).json({ success: false, message: 'Token manquant' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Profile.findById(decoded.userId);

    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });

    await Profile.findByIdAndDelete(decoded.userId);

    res.json({ success: true, message: 'Compte supprimé avec succès.' });
  } catch (err) {
    console.error('Erreur de token ou suppression :', err);
    res.status(401).json({ success: false, message: 'Token invalide ou suppression impossible.' });
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
