// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('MongoDB connecté'))
//   .catch(err => console.error(err));

// app.get('/api/hello', (req, res) => {
//   res.json({ message: 'Hello depuis le backend !' });
// });

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => console.log(`Serveur sur le port ${PORT}`));

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

// Démarrage serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
