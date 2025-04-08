const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

// Wrap the createUser route with the upload middleware
router.post("/new", (req, res, next) => {
    userController.upload(req, res, function (err) {
      if (err) {
        // Handle multer file upload errors
        return res.status(400).json({ error: err.message });
      }
      // If no error, proceed to createUser
      userController.createUser(req, res);
    });
  });
router.post("/login", userController.login); // Connexion d'un utilisateur
router.get("/users", userController.getAllUsers); // Récupérer tous les utilisateurs
router.get("/:id", userController.getUserByPk); // Récupérer un utilisateur par ID
router.put("/:id", userController.updateUser); // Mettre à jour un utilisateur
router.delete("/delete/:id", userController.deleteUser); // Supprimer un utilisateur
router.get('/check-email', userController.checkEmailExists); // Vérifier que l'email n'est pas déjà utilisé

module.exports = router;
