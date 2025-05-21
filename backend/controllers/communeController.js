const { Commune } = require('../models');

exports.getAllCommunes = async (req, res) => {
  try {
    const communes = await Commune.findAll({
      include: [
        { model: Commune.associations.Daira },
        { model: Commune.associations.Lieu }
      ]
    });
    res.status(200).json(communes);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des communes' });
  }
};

exports.getCommuneById = async (req, res) => {
  try {
    const commune = await Commune.findByPk(req.params.id, {
      include: [
        { model: Commune.associations.Daira },
        { model: Commune.associations.Lieu }
      ]
    });
    if (commune) {
      res.status(200).json(commune);
    } else {
      res.status(404).json({ error: 'Commune non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la commune' });
  }
};

exports.createCommune = async (req, res) => {
  try {
    const { nom, daira_id } = req.body;
    const newCommune = await Commune.create({
      nom,
      daira_id
    });
    res.status(201).json(newCommune);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de la commune' });
  }
};

exports.updateCommune = async (req, res) => {
  try {
    const { nom, daira_id } = req.body;
    const commune = await Commune.findByPk(req.params.id);
    if (commune) {
      await commune.update({ nom, daira_id });
      res.status(200).json(commune);
    } else {
      res.status(404).json({ error: 'Commune non trouvée' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour de la commune' });
  }
};

exports.deleteCommune = async (req, res) => {
  try {
    const commune = await Commune.findByPk(req.params.id);
    if (commune) {
      await commune.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Commune non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la commune' });
  }
};