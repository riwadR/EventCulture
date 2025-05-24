const { Wilaya } = require('../models');

exports.getAllWilayas = async (req, res) => {
  try {
    const wilayas = await Wilaya.findAll({
      include: [{ model: Wilaya.associations.Daira }]
    });
    res.status(200).json(wilayas);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des wilayas' });
  }
};

exports.getWilayaById = async (req, res) => {
  try {
    const wilaya = await Wilaya.findByPk(req.params.id, {
      include: [{ model: Wilaya.associations.Daira }]
    });
    if (wilaya) {
      res.status(200).json(wilaya);
    } else {
      res.status(404).json({ error: 'Wilaya non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la wilaya' });
  }
};

exports.createWilaya = async (req, res) => {
  try {
    const { nom } = req.body;
    const newWilaya = await Wilaya.create({
      nom
    });
    res.status(201).json(newWilaya);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de la wilaya' });
  }
};

exports.updateWilaya = async (req, res) => {
  try {
    const { nom } = req.body;
    const wilaya = await Wilaya.findByPk(req.params.id);
    if (wilaya) {
      await wilaya.update({ nom });
      res.status(200).json(wilaya);
    } else {
      res.status(404).json({ error: 'Wilaya non trouvée' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour de la wilaya' });
  }
};

exports.deleteWilaya = async (req, res) => {
  try {
    const wilaya = await Wilaya.findByPk(req.params.id);
    if (wilaya) {
      await wilaya.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Wilaya non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la wilaya' });
  }
};