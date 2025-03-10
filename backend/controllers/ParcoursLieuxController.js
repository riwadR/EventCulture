// controllers/ParcoursLieuxController.js
const ParcoursLieux = require('../models/Parcours_Lieux');

// Créer un nouveau parcours-lieu
const createParcoursLieux = async (req, res) => {
  try {
    const { id_parcours, id_lieu, id_evenement, ordre } = req.body;
    const newParcoursLieux = await ParcoursLieux.create({ id_parcours, id_lieu, id_evenement, ordre });
    res.status(201).json({ message: 'Parcours-Lieu créé avec succès', parcoursLieux: newParcoursLieux });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création du parcours-lieu' });
  }
};

// Obtenir tous les parcours-lieux
const getAllParcoursLieux = async (req, res) => {
  try {
    const parcoursLieux = await ParcoursLieux.findAll();
    res.status(200).json(parcoursLieux);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des parcours-lieux' });
  }
};

// Obtenir un parcours-lieu par son ID
const getParcoursLieuxById = async (req, res) => {
  const { id } = req.params;
  try {
    const parcoursLieux = await ParcoursLieux.findByPk(id);
    if (!parcoursLieux) {
      return res.status(404).json({ message: 'Parcours-Lieu non trouvé' });
    }
    res.status(200).json(parcoursLieux);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du parcours-lieu' });
  }
};

// Supprimer un parcours-lieu
const deleteParcoursLieux = async (req, res) => {
  try {
    const parcoursLieux = await ParcoursLieux.findByPk(req.params.id);
    if (!parcoursLieux) return res.status(404).json({ error: 'Parcours-Lieu non trouvé.' });

    await parcoursLieux.destroy();
    res.status(204).json({ message: 'Parcours-Lieu supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un parcours-lieu
const updateParcoursLieux = async (req, res) => {
  try {
    const parcoursLieux = await ParcoursLieux.findByPk(req.params.id);
    if (!parcoursLieux) return res.status(404).json({ error: 'Parcours-Lieu non trouvé.' });

    await parcoursLieux.update(req.body);
    res.status(200).json({ message: 'Parcours-Lieu mis à jour avec succès', parcoursLieux });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createParcoursLieux,
  getAllParcoursLieux,
  getParcoursLieuxById,
  deleteParcoursLieux,
  updateParcoursLieux,
};
