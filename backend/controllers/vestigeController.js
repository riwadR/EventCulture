const { Vestige, DetailLieu } = require('../models');

// Créer un vestige
exports.createVestige = async (req, res) => {
  try {
    const vestige = await Vestige.create(req.body);
    res.status(201).json(vestige);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtenir tous les vestiges avec leurs lieux détaillés
exports.getAllVestiges = async (req, res) => {
  try {
    const vestiges = await Vestige.findAll({
      include: {
        model: DetailLieu,
        as: 'DetailLieu', // alias utilisé dans le modèle
      },
    });
    res.status(200).json(vestiges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir un vestige par ID avec son lieu détaillé
exports.getVestigeById = async (req, res) => {
  try {
    const vestige = await Vestige.findByPk(req.params.id, {
      include: {
        model: DetailLieu,
        as: 'DetailLieu',
      },
    });
    if (!vestige) {
      return res.status(404).json({ message: 'Vestige non trouvé' });
    }
    res.status(200).json(vestige);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un vestige
exports.updateVestige = async (req, res) => {
  try {
    const vestige = await Vestige.findByPk(req.params.id);
    if (!vestige) {
      return res.status(404).json({ message: 'Vestige non trouvé' });
    }
    await vestige.update(req.body);
    res.status(200).json(vestige);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un vestige
exports.deleteVestige = async (req, res) => {
  try {
    const vestige = await Vestige.findByPk(req.params.id);
    if (!vestige) {
      return res.status(404).json({ message: 'Vestige non trouvé' });
    }
    await vestige.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
