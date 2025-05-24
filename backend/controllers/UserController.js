const { User } = require('../models');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: User.associations.Role, through: { attributes: [] } },
        { model: User.associations.EvenementsParticipes, through: { attributes: [] } },
        { model: User.associations.Presentations }
      ]
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        { model: User.associations.Role, through: { attributes: [] } },
        { model: User.associations.EvenementsParticipes, through: { attributes: [] } },
        { model: User.associations.Presentations }
      ]
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { nom, prenom, date_naissance, nationalite, biographie, photo_url } = req.body;
    const newUser = await User.create({
      nom,
      prenom,
      date_naissance,
      nationalite,
      biographie,
      photo_url
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de l\'utilisateur' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { nom, prenom, date_naissance, nationalite, biographie, photo_url } = req.body;
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.update({
        nom,
        prenom,
        date_naissance,
        nationalite,
        biographie,
        photo_url
      });
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
  }
};