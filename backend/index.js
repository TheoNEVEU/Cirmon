const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error(err));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello depuis le backend !' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Serveur sur le port ${PORT}`));
