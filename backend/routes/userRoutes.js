const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

router.post("/new", userController.createUser); // Créer un utilisateur
router.post("/login", userController.login); // Connexion d'un utilisateur
router.get("/users", userController.getAllUsers); // Récupérer tous les utilisateurs
router.get("/:id", userController.getUserByPk); // Récupérer un utilisateur par ID
router.put("/:id", userController.updateUser); // Mettre à jour un utilisateur
router.delete("/delete/:id", userController.deleteUser); // Supprimer un utilisateur

module.exports = router;
