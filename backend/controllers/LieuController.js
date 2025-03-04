const Lieu = require('../models/Lieu');

// Créer un nouveau lieu
const createLieu = async (req, res) => {
  try {
    const { nom, adresse, ville, pays } = req.body;
    const newLieu = await Lieu.create({ nom, adresse, ville, pays });
    res.status(201).json({ message: 'Lieu créé avec succès', lieu: newLieu });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création du lieu' });
  }
};

// Obtenir tous les lieux
const getAllLieux = async (req, res) => {
  try {
    const lieux = await Lieu.findAll();
    res.status(200).json(lieux);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des lieux' });
  }
};

// Obtenir un lieu par son ID
const getLieuById = async (req, res) => {
  const { id } = req.params;
  try {
    const lieu = await Lieu.findByPk(id);
    if (!lieu) {
      return res.status(404).json({ message: 'Lieu non trouvé' });
    }
    res.status(200).json(lieu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du lieu' });
  }
};

// Supprimer un lieu
const deleteLieu = async (req, res) => {
  try {
    const lieu = await Lieu.findByPk(req.params.id);
    if (!lieu) return res.status(404).json({ error: 'Lieu non trouvé.' });

    await lieu.destroy();
    res.status(204).json({ message: 'Lieu supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un lieu
const updateLieu = async (req, res) => {
  try {
    const lieu = await Lieu.findByPk(req.params.id);
    if (!lieu) return res.status(404).json({ error: 'Lieu non trouvé.' });

    await lieu.update(req.body);
    res.status(200).json({ message: 'Lieu mis à jour avec succès', lieu });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createLieu,
  getAllLieux,
  getLieuById,
  deleteLieu,
  updateLieu
};
