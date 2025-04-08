const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");
const authMiddleware = require("../middlewares/authMiddleware");

// Routes publiques d'authentification
router.post("/register", authController.register); // Inscription d'un utilisateur
router.post("/login", authController.login); // Connexion d'un utilisateur

// Routes protégées (nécessitant un token valide)
router.get("/me", authMiddleware.verifyToken, authController.getCurrentUser); // Récupérer les données de l'utilisateur connecté
router.put("/profile", authMiddleware.verifyToken, authController.updateProfile); // Mettre à jour le profil utilisateur

module.exports = router; 