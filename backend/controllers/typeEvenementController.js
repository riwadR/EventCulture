const { TypeEvenement, Evenement } = require('../models');

exports.getAllTypeEvenements = async (req, res) => {
  try {
    const typeEvenements = await TypeEvenement.findAll({
      include: [{ model: Evenement }]
    });
    res.status(200).json(typeEvenements);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des types d\'événements' });
  }
};

exports.getTypeEvenementById = async (req, res) => {
  try {
    const typeEvenement = await TypeEvenement.findByPk(req.params.id, {
      include: [{ model: Evenement }]
    });
    if (typeEvenement) {
      res.status(200).json(typeEvenement);
    } else {
      res.status(404).json({ error: 'Type d\'événement non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du type d\'événement' });
  }
};

exports.createTypeEvenement = async (req, res) => {
  try {
    const { nom_type, description } = req.body;
    const newTypeEvenement = await TypeEvenement.create({
      nom_type,
      description
    });
    res.status(201).json(newTypeEvenement);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création du type d\'événement' });
  }
};

exports.updateTypeEvenement = async (req, res) => {
  try {
    const { nom_type, description } = req.body;
    const typeEvenement = await TypeEvenement.findByPk(req.params.id);
    if (typeEvenement) {
      await typeEvenement.update({ nom_type, description });
      res.status(200).json(typeEvenement);
    } else {
      res.status(404).json({ error: 'Type d\'événement non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour du type d\'événement' });
  }
};

exports.deleteTypeEvenement = async (req, res) => {
  try {
    const typeEvenement = await TypeEvenement.findByPk(req.params.id);
    if (typeEvenement) {
      await typeEvenement.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Type d\'événement non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du type d\'événement' });
  }
};
