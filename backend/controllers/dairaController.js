const { Daira } = require('../models');

exports.getAllDairas = async (req, res) => {
  try {
    const dairas = await Daira.findAll({
      include: [
        { model: Daira.associations.Wilaya },
        { model: Daira.associations.Commune }
      ]
    });
    res.status(200).json(dairas);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des daïras' });
  }
};

exports.getDairaById = async (req, res) => {
  try {
    const daira = await Daira.findByPk(req.params.id, {
      include: [
        { model: Daira.associations.Wilaya },
        { model: Daira.associations.Commune }
      ]
    });
    if (daira) {
      res.status(200).json(daira);
    } else {
      res.status(404).json({ error: 'Daïra non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la daïra' });
  }
};

exports.createDaira = async (req, res) => {
  try {
    const { nom, wilaya_id } = req.body;
    const newDaira = await Daira.create({
      nom,
      wilaya_id
    });
    res.status(201).json(newDaira);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de la daïra' });
  }
};

exports.updateDaira = async (req, res) => {
  try {
    const { nom, wilaya_id } = req.body;
    const daira = await Daira.findByPk(req.params.id);
    if (daira) {
      await daira.update({ nom, wilaya_id });
      res.status(200).json(daira);
    } else {
      res.status(404).json({ error: 'Daïra non trouvée' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour de la daïra' });
  }
};

exports.deleteDaira = async (req, res) => {
  try {
    const daira = await Daira.findByPk(req.params.id);
    if (daira) {
      await daira.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Daïra non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la daïra' });
  }
};