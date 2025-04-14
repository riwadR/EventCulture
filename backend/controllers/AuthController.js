const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Fonction pour générer un token JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Token valide 7 jours
  );
};

// Inscription d'un nouvel utilisateur
const register = async (req, res) => {
  try {
    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email: req.body.email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
    }

    // Valider le mot de passe (si vous avez une fonction de validation)
    if (req.body.password) {
      // Si vous avez une fonction de validation de mot de passe, utilisez-la ici
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Créer l'utilisateur
    const userData = {
      ...req.body,
      password: hashedPassword,
      role: req.body.role || 'user' // Rôle par défaut
    };

    const user = await User.create(userData);

    // Générer un token JWT
    const token = generateToken(user.id);

    // Supprimer le mot de passe de la réponse
    const { password, ...userWithoutPassword } = user.toJSON();

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
  }
};

// Connexion d'un utilisateur
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Générer un token JWT
    const token = generateToken(user.id_user);

    // Supprimer le mot de passe de la réponse
    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.status(200).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
  }
};

// Récupérer les informations de l'utilisateur connecté
const getCurrentUser = async (req, res) => {
  try {
    // req.user est défini par le middleware d'authentification
    res.status(200).json(req.user);
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour le profil utilisateur
const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    // Si le mot de passe est fourni, le hasher
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    
    // Mettre à jour les données de l'utilisateur
    await user.update(req.body);
    
    // Supprimer le mot de passe de la réponse
    const { password, ...updatedUser } = user.toJSON();
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile
}; 