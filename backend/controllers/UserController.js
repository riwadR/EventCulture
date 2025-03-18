const User = require("../models/User");

//  Créer un utilisateur
const createUser = async (req, res) => {
  try {
//  const { photos } = req.body;
/*  if (!photos || photos.length < 3) {
      return res.status(400).json({ error: "Vous devez ajouter au moins 3 photos." });
    } */
    
    const user = await User.create(req.body);
    res.status(201).json({message: 'Utilisateur créé avec succès', success: true, user});
  } catch (error) {
    res.status(400).json({ error: error.message, message: error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    if (user.password !== password) return res.status(401).json({ error: "Mot de passe incorrect" });
    res.status(200).json(user);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Récupérer un utilisateur par ID
const getUserByPk = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Mettre à jour un utilisateur
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

/*
    const { photos } = req.body;
    if (photos && photos.length < 3) {
      return res.status(400).json({ error: "Vous devez ajouter au moins 3 photos." });
    } */
    
    await user.update(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//  Supprimer un utilisateur
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    await user.destroy();
    res.status(204).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  updateUser,
  getUserByPk,
  getAllUsers,
  deleteUser,
  login
}