const User = require("../models/User");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt'); 
const { check, validationResult } = require("express-validator");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const uploadDir = path.join(__dirname, '../uploads/users');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)){
          fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
      } else {
          cb(new Error('Type de fichier non autorisé. Utilisez JPEG, PNG ou GIF.'));
      }
  }
}).array('photos', 5); // Allow up to 5 photos

// Fonction pour valider le mot de passe
const validatePassword = (password) => {
  // Définir les règles de validation
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const errors = [];
  
  if (password.length < minLength) {
    errors.push(`Le mot de passe doit contenir au moins ${minLength} caractères`);
  }
  
  if (!hasUpperCase) {
    errors.push("Le mot de passe doit contenir au moins une lettre majuscule");
  }
  
  if (!hasLowerCase) {
    errors.push("Le mot de passe doit contenir au moins une lettre minuscule");
  }
  
  if (!hasNumbers) {
    errors.push("Le mot de passe doit contenir au moins un chiffre");
  }
  
  if (!hasSpecialChar) {
    errors.push("Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*(),.?\":{}|<>)");
  }
  
  return errors;
};

// Créer un utilisateur
const createUser = async (req, res) => {
  try {
      // Enhanced logging
      console.log("=============== USER REGISTRATION ===============");
      console.log("Full Request Body:", JSON.stringify(req.body, null, 2));
      console.log("Request Files:", req.files ? req.files.map(f => f.originalname) : 'No files');
      
      // Validation for required fields
      const requiredFields = ['firstName', 'lastName', 'email', 'password', 'phone', 'genre', 'departement', 'participation'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
          console.error("Missing Fields:", missingFields);
          return res.status(400).json({ 
              error: `Champs requis manquants: ${missingFields.join(', ')}`,
              missingFields: missingFields
          });
      }

      // Handle file uploads
      const photoPaths = req.files ? req.files.map(file => file.path.split('uploads')[1]) : [];

      // Valider le mot de passe avec la nouvelle fonction
      const passwordErrors = validatePassword(req.body.password);
      if (passwordErrors.length > 0) {
          return res.status(400).json({ 
              error: "Le mot de passe ne respecte pas les critères de sécurité", 
              details: passwordErrors 
          });
      }

      // Hacher le mot de passe avant de le stocker
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Créer les données de l'utilisateur
      const userData = {
          ...req.body,
          password: hashedPassword,
          photos: photoPaths,
          role: req.body.role || 'user'
      };

      // Créer l'utilisateur dans la base de données
      const user = await User.create(userData);

      // Supprimer les données sensibles avant d'envoyer la réponse
      const { password, ...userResponse } = user.toJSON();

      console.log("=============== USER REGISTRATION SUCCESS ===============");
      console.log("User Created:", userResponse);

      res.status(201).json({
          message: 'Utilisateur créé avec succès',
          success: true,
          user: userResponse
      });
  } catch (error) {
      console.error("=============== USER REGISTRATION ERROR ===============");
      console.error('Detailed Error:', error);

      // Handle unique constraint errors (e.g., duplicate email)
      if (error.name === 'SequelizeUniqueConstraintError') {
          return res.status(400).json({ 
              error: 'Un utilisateur avec cet email existe déjà',
              details: error.errors.map(e => e.message)
          });
      }

      // Handle validation errors
      if (error.name === 'SequelizeValidationError') {
          return res.status(400).json({ 
              error: 'Erreur de validation',
              details: error.errors.map(e => e.message)
          });
      }

      // Generic error response
      res.status(500).json({ 
          error: 'Erreur interne du serveur',
          details: error.message 
      });
  }
};

// Connexion d'un utilisateur
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    
    // Vérifier le mot de passe avec bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) return res.status(401).json({ error: "Mot de passe incorrect" });
    
    // Supprimer le mot de passe avant d'envoyer la réponse
    const { password: _, ...userResponse } = user.toJSON();
    
    res.status(200).json(userResponse);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // Exclure le mot de passe des résultats
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un utilisateur par ID
const getUserByPk = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] } // Exclure le mot de passe
    });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un utilisateur
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    // Si le mot de passe est mis à jour, valider et hacher
    if (req.body.password) {
      const passwordErrors = validatePassword(req.body.password);
      if (passwordErrors.length > 0) {
        return res.status(400).json({ 
          error: "Le mot de passe ne respecte pas les critères de sécurité", 
          details: passwordErrors 
        });
      }
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    // Mettre à jour l'utilisateur
    await user.update(req.body);
    
    // Supprimer le mot de passe avant d'envoyer la réponse
    const { password, ...userResponse } = user.toJSON();
    
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    await user.destroy();
    res.status(204).send(); // Réponse "No content" pour la suppression réussie
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkEmailExists = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ where: { email } });
    res.status(200).json({ exists: !!user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  checkEmailExists,
  createUser,
  updateUser,
  getUserByPk,
  getAllUsers,
  deleteUser,
  upload,
  login
};
