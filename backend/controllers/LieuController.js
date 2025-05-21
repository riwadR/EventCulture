const { Lieu } = require('../models');

exports.getAllLieux = async (req, res) => {
  try {
    const lieux = await Lieu.findAll({
      include: [{ model: Lieu.associations.Commune }]
    });
    res.status(200).json(lieux);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des lieux' });
  }
};

exports.getLieuById = async (req, res) => {
  try {
    const lieu = await Lieu.findByPk(req.params.id, {
      include: [{ model: Lieu.associations.Commune }]
    });
    if (lieu) {
      res.status(200).json(lieu);
    } else {
      res.status(404).json({ error: 'Lieu non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du lieu' });
  }
};

exports.createLieu = async (req, res) => {
  try {
    const { nom, adresse, commune_id } = req.body;
    const newLieu = await Lieu.create({
      nom,
      adresse,
      commune_id
    });
    res.status(201).json(newLieu);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création du lieu' });
  }
};

exports.updateLieu = async (req, res) => {
  try {
    const { nom, adresse, commune_id } = req.body;
    const lieu = await Lieu.findByPk(req.params.id);
    if (lieu) {
      await lieu.update({ nom, adresse, commune_id });
      res.status(200).json(lieu);
    } else {
      res.status(404).json({ error: 'Lieu non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour du lieu' });
  }
};

exports.deleteLieu = async (req, res) => {
  try {
    const lieu = await Lieu.findByPk(req.params.id);
    if (lieu) {
      await lieu.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Lieu non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du lieu' });
  }
};