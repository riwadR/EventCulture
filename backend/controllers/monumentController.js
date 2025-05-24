const { Monument, DetailLieu } = require('../models');

// Créer un monument
exports.createMonument = async (req, res) => {
  try {
    const monument = await Monument.create(req.body);
    res.status(201).json(monument);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtenir tous les monuments avec DetailLieu
exports.getAllMonuments = async (req, res) => {
  try {
    const monuments = await Monument.findAll({
      include: {
        model: DetailLieu,
        as: 'DetailLieu' // Assurez-vous que l'alias est bien défini dans Monument.associate
      }
    });
    res.status(200).json(monuments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir un monument par ID avec DetailLieu
exports.getMonumentById = async (req, res) => {
  try {
    const monument = await Monument.findByPk(req.params.id, {
      include: {
        model: DetailLieu,
        as: 'DetailLieu'
      }
    });
    if (!monument) {
      return res.status(404).json({ message: 'Monument non trouvé' });
    }
    res.status(200).json(monument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un monument
exports.updateMonument = async (req, res) => {
  try {
    const monument = await Monument.findByPk(req.params.id);
    if (!monument) {
      return res.status(404).json({ message: 'Monument non trouvé' });
    }
    await monument.update(req.body);
    res.status(200).json(monument);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un monument
exports.deleteMonument = async (req, res) => {
  try {
    const monument = await Monument.findByPk(req.params.id);
    if (!monument) {
      return res.status(404).json({ message: 'Monument non trouvé' });
    }
    await monument.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
