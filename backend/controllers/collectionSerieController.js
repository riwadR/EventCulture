const { CollectionSerie } = require('../models');

exports.getAllCollectionSeries = async (req, res) => {
  try {
    const collectionSeries = await CollectionSerie.findAll();
    res.status(200).json(collectionSeries);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des séries de collection' });
  }
};

exports.getCollectionSerieById = async (req, res) => {
  try {
    const collectionSerie = await CollectionSerie.findByPk(req.params.id);
    if (collectionSerie) {
      res.status(200).json(collectionSerie);
    } else {
      res.status(404).json({ error: 'Série de collection non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la série de collection' });
  }
};

exports.createCollectionSerie = async (req, res) => {
  try {
    const { nom, description, type } = req.body;
    const newCollectionSerie = await CollectionSerie.create({
      nom,
      description,
      type
    });
    res.status(201).json(newCollectionSerie);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de la série de collection' });
  }
};

exports.updateCollectionSerie = async (req, res) => {
  try {
    const { nom, description, type } = req.body;
    const collectionSerie = await CollectionSerie.findByPk(req.params.id);
    if (collectionSerie) {
      await collectionSerie.update({ nom, description, type });
      res.status(200).json(collectionSerie);
    } else {
      res.status(404).json({ error: 'Série de collection non trouvée' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour de la série de collection' });
  }
};

exports.deleteCollectionSerie = async (req, res) => {
  try {
    const collectionSerie = await CollectionSerie.findByPk(req.params.id);
    if (collectionSerie) {
      await collectionSerie.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Série de collection non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la série de collection' });
  }
};