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
  origin: ['http://localhost:' + process.env.PORT, 'https://agirvillagesaures.fr'],
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
const catalogueRoutes = require("./routes/catalogueRoutes");
const commentaireRoutes = require("./routes/commentaireRoutes");
const eventRoutes = require("./routes/eventRoutes");
const lieuRoutes = require("./routes/lieuRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const participantRoutes = require("./routes/participantRoutes");
const parcoursRoutes = require("./routes/parcoursRoutes");
const parcoursLieuxRoutes = require("./routes/parcoursLieuxRoutes");
const programmeRoutes = require("./routes/programmeRoutes");
const oeuvreRoutes = require("./routes/oeuvreRoutes");
const authRoutes = require("./routes/authRoutes");

// Définition des routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/programmes", programmeRoutes);
app.use("/api/lieux", lieuRoutes);
app.use("/api/catalogues", catalogueRoutes);
app.use("/api/commentaires", commentaireRoutes);
app.use("/api/medias", mediaRoutes);
app.use("/api/parcours", parcoursRoutes);
app.use("/api/parcoursLieux", parcoursLieuxRoutes);
app.use("/api/participants", participantRoutes);
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

// Synchronisation de la base de données
sequelize.sync({ alter: true })
  .then(() => console.log("Base de données synchronisée."))
  .catch((err) => console.error("Erreur de synchronisation :", err));

// Trouver un port libre et démarrer le serveur
findFreePort(process.env.PORT).then(([port]) => {
  app.listen(port, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${port}`);
  });
}).catch(err => {
  console.error("❌ Impossible de trouver un port libre :", err);
});

module.exports = app;