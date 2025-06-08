Coucou les petits loups, voici un résumé du fontionnement du projet :

# Cirmon TCGP

Cirmon TCGP est le site qui permttra de jouer... bah au cirmon quoi.  
Il est composé de deux parties :
- Un **frontend React** (Vite + TypeScript), hébergé sur **GitHub Pages**
- Un **backend Node.js/Express**, connecté à une **base MongoDB**, hébergé sur **Render**

---

## 🔧 Architecture du projet

Cirmon/
├── backend/ # Serveur Node.js + Express
│ ├── index.js # Point d’entrée du serveur
│ ├── models/ # Schémas Mongoose (ex: Cards.js)
│ └── .env # Clés secrètes (non suivi par Git)
│
├── frontend/ # Application React
│ ├── public/ # Dossier public (images, icônes...)
│ ├── src/ # Code source React
│ └── vite.config.ts # Configuration Vite
│
└── README.md # Ce fichier mdr


---

## 🚀 Démarrage rapide

### 1. Cloner le projet

```bash
git clone https://github.com/<ton-username>/<nom-du-repo>.git
cd Cirmon
```

### 2. Backend

Pour utiliser le backend, vous aurez besoin d'intaller node et les dépendances avec :
```bash
cd backend
npm install
```

Puis vous pourrez le lancer avec 
```bash
cd backend
npm run start
```

### 3. Frontend

Pour le frontend, c'est pareil :
```bash
cd frontend
npm install
```

Mais pour le lancer, c'est avec :
```bash
cd frontend
npm run dev 
```


## 🌐 Déploiement

### 1. Backend

Lorsque le backend est complet et sans bug, pour le publier, il faut le push sur la branche gh-pages_backend avec :

```bash
git add dist -f
git commit -m "déploiement"
git subtree push --prefix dist origin gh-pages_backend
```
La misa à jour peut prendre quelques minutes car Render doit déployer le projet.

### 2. Frontend 

Une fois vos modifications complètes, sans bug, il faut build avec :

```bash
npm run build
```

Une fois le build réalisé (et créé dans le dossier Cirmon/frontend/dist), vous pouvez pousser sur la branche gh-pages (qui est la branche publiée) :

```bash
npm run deploy
```

Le site sera en ligne sur :
https://theoneveu.github.io/Cirmon/, quelques minutes plus tard.