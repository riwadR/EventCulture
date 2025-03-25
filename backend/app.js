const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/database");
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
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json())
.use(cors())
.use("/api/users", userRoutes) // Utiliser les routes User
.use("/api/events", eventRoutes) // Utiliser les routes event
.use("/api/programmes", programmeRoutes) // Utiliser les routes programme
.use("/api/lieux", lieuRoutes) // Utiliser les routes lieu
.use("/api/catalogues", catalogueRoutes) // Utiliser les routes catalogues
.use("/api/commentaires", commentaireRoutes) // Utiliser les routes commentaire
.use("/api/medias", mediaRoutes) // Utiliser les routes media
.use("/api/parcours", parcoursRoutes) // Utiliser les routes parcours
.use("/api/parcoursLieux", parcoursLieuxRoutes) // Utiliser les routes parcoursLieux
.use("api/participants", participantRoutes) // Utiliser les routes participants
.use("/api/oeuvres", oeuvreRoutes); // Utiliser les routes oeuvre


// Synchroniser la base de données
sequelize.sync({ alter: true })
  .then(() => {
    console.log("Base de données synchronisée.");
  })
  .catch((err) => console.error("Erreur de synchronisation :", err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
