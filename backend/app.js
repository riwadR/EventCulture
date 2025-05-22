const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const sequelize = require("./config/database");
const path = require("path");
const findFreePort = require("find-free-port");
const app = express();


// Chargement des variables d'environnement
dotenv.config();

// CORS middleware first
app.use(cors({
  origin: ['http://localhost:' + process.env.PORT, 'http://localhost:3000', 'https://agirvillagesaures.fr'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', ]
}));

// Security middleware
app.use(helmet());

// Parsing middlewares - order matters
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importation des routes
const userRoutes = require("./routes/userRoutes");

const commentaireRoutes = require("./routes/commentaireRoutes");


const mediaRoutes = require("./routes/mediaRoutes");

const parcoursRoutes = require("./routes/parcoursRoutes");
const parcoursLieuxRoutes = require("./routes/parcoursLieuxRoutes");
const programmeRoutes = require("./routes/programmeRoutes");
const oeuvreRoutes = require("./routes/oeuvreRoutes");
const authRoutes = require("./routes/authRoutes");
const evenementRoutes = require('./routes/evenementRoutes');


const evenementOeuvreRoutes = require('./routes/evenementOeuvreRoutes');
const evenementUserRoutes = require('./routes/evenementUserRoutes');
const filmRoutes = require('./routes/filmRoutes');

const livreRoutes = require('./routes/livreRoutes');
const oeuvreArtRoutes = require('./routes/oeuvreArtRoutes');
// Définition des routes
const oeuvreCategorieRoutes = require('./routes/oeuvreCategorieRoutes');
const lieuRoutes = require('./routes/lieuRoutes');

const tagMotCleRoutes = require('./routes/tagMotCleRoutes');
const oeuvreTagRoutes = require('./routes/oeuvreTagRoutes');
const oeuvreUserRoutes = require('./routes/oeuvreUserRoutes');
const roleRoutes = require('./routes/roleRoutes');
const userRoleRoutes = require('./routes/userRoleRoutes');
const organisationRoutes = require('./routes/organisationRoutes');
const evenementOrganisationRoutes = require('./routes/evenementOrganisationRoutes');

const dairaRoutes = require('./routes/dairaRoutes');
const critiqueEvaluationRoutes = require('./routes/critiqueEvaluationRoutes');
const communeRoutes = require('./routes/communeRoutes');
const collectionSerieRoutes = require('./routes/collectionSerieRoutes');
const typeEvenementRoutes = require('./routes/typeEvenementRoutes');
const typeOeuvreRoutes = require('./routes/typeOeuvreRoutes');
const detailLieuRoutes = require('./routes/detailLieuRoutes');
const lieuMediaRoutes = require('./routes/lieuMediaRoutes');
const monumentRoutes = require('./routes/monumentRoutes');
const vestigeRoutes = require('./routes/vesitigeRoutes');
app.use('/api/vestige', vestigeRoutes );
app.use('/api/monument', monumentRoutes );
app.use('/api/lieu-media', lieuMediaRoutes );
app.use('/api/detail-lieu', detailLieuRoutes );
app.use('/api/type-oeuvres', typeOeuvreRoutes);
app.use('/api/type-evenements', typeEvenementRoutes);
app.use('/api/collection-series', collectionSerieRoutes);
app.use('/api/communes', communeRoutes);
app.use('/api/critiques', critiqueEvaluationRoutes);
app.use('/api/dairas', dairaRoutes);
app.use('/api/evenement-oeuvres', evenementOeuvreRoutes);
app.use('/api/evenement-organisations', evenementOrganisationRoutes);

app.use('/api/organisations', organisationRoutes);
app.use('/api/user-roles', userRoleRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/oeuvre-users', oeuvreUserRoutes);
app.use('/api/oeuvre-tags', oeuvreTagRoutes);
app.use('/api/tag-mot-cles', tagMotCleRoutes);

app.use('/api/parcours-lieux', parcoursLieuxRoutes);
app.use('/api/lieux', lieuRoutes);
app.use('/api/oeuvre-categories', oeuvreCategorieRoutes);
app.use('/api/oeuvre-arts', oeuvreArtRoutes);

app.use('/api/livres', livreRoutes);
app.use('/api/films', filmRoutes);
app.use('/api/evenement-users', evenementUserRoutes);
app.use('/api/evenement-oeuvres', evenementOeuvreRoutes);
app.use('/api/collections-series', collectionSerieRoutes);
app.use("/api/users", userRoutes);
app.use("/api/programmes", programmeRoutes);
app.use("/api/lieux", lieuRoutes);
app.use('/api/evenements', evenementRoutes);
app.use("/api/commentaires", commentaireRoutes);
app.use("/api/medias", mediaRoutes);
app.use("/api/parcours", parcoursRoutes);
app.use("/api/parcoursLieux", parcoursLieuxRoutes);
app.use('/api/critiques', critiqueEvaluationRoutes);
app.use("/api/oeuvres", oeuvreRoutes);
app.use("/api/auth", authRoutes);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});


// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Une erreur est survenue', 
    error: process.env.NODE_ENV === 'production' ? 'Erreur interne du serveur' : err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});
const models = require("./models");
// Synchronisation de la base de données
sequelize.sync({ alter: true })
  .then(() => console.log("Base de données synchronisée."))
  .catch((err) => console.error("Erreur de synchronisation :", err));

// Trouver un port libre et démarrer le serveur
const PORT_START = 3000;
const PORT_END = 3010;

findFreePort(PORT_START, PORT_END, '127.0.0.1', (err, freePort) => {
  if (err) {
    console.error("❌ Impossible de trouver un port libre :", err);
    process.exit(1);
  }

  app.listen(freePort, () => {
    console.log(`✅ Serveur lancé sur le port ${freePort}`);
  });
});

module.exports = app;