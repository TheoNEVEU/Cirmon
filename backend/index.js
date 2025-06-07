require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <-- 1. importe cors

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // <-- 2. active cors ici, juste après la création de l'app

// Connexion MongoDB (assure-toi que MONGODB_URI est bien dans ton .env)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connecté'))
.catch(err => console.error('Erreur MongoDB :', err));

// Schéma simple pour tester
const TestSchema = new mongoose.Schema({
  message: String,
});

const Test = mongoose.model('Test', TestSchema);
const Card = require('./models/Cards');


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

app.get('/cards', async (req, res) => {
  console.log('GET /cards appelé');  // <== ajoute cette ligne pour debug
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// Démarrage serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
