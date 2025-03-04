// controllers/ParcoursController.js
const Parcours = require('../models/Parcours');

// Créer un nouveau parcours
const createParcours = async (req, res) => {
  try {
    const { nom, description } = req.body;
    const newParcours = await Parcours.create({ nom, description });
    res.status(201).json({ message: 'Parcours créé avec succès', parcours: newParcours });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création du parcours' });
  }
};

// Obtenir tous les parcours
const getAllParcours = async (req, res) => {
  try {
    const parcours = await Parcours.findAll();
    res.status(200).json(parcours);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des parcours' });
  }
};

// Obtenir un parcours par son ID
const getParcoursById = async (req, res) => {
  const { id } = req.params;
  try {
    const parcours = await Parcours.findByPk(id);
    if (!parcours) {
      return res.status(404).json({ message: 'Parcours non trouvé' });
    }
    res.status(200).json(parcours);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du parcours' });
  }
};

// Supprimer un parcours
const deleteParcours = async (req, res) => {
  try {
    const parcours = await Parcours.findByPk(req.params.id);
    if (!parcours) return res.status(404).json({ error: 'Parcours non trouvé.' });

    await parcours.destroy();
    res.status(204).json({ message: 'Parcours supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un parcours
const updateParcours = async (req, res) => {
  try {
    const parcours = await Parcours.findByPk(req.params.id);
    if (!parcours) return res.status(404).json({ error: 'Parcours non trouvé.' });

    await parcours.update(req.body);
    res.status(200).json({ message: 'Parcours mis à jour avec succès', parcours });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createParcours,
  getAllParcours,
  getParcoursById,
  deleteParcours,
  updateParcours,
};
