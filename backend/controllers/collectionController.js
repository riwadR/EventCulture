const { Collection } = require('../models');

exports.getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.findAll({
      include: [{ model: Collection.associations.Oeuvres, through: { attributes: [] } }]
    });
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des collections' });
  }
};

exports.getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findByPk(req.params.id, {
      include: [{ model: Collection.associations.Oeuvres, through: { attributes: [] } }]
    });
    if (collection) {
      res.status(200).json(collection);
    } else {
      res.status(404).json({ error: 'Collection non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la collection' });
  }
};

exports.createCollection = async (req, res) => {
  try {
    const { nom, description } = req.body;
    const newCollection = await Collection.create({
      nom,
      description
    });
    res.status(201).json(newCollection);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de la collection' });
  }
};

exports.updateCollection = async (req, res) => {
  try {
    const { nom, description } = req.body;
    const collection = await Collection.findByPk(req.params.id);
    if (collection) {
      await collection.update({ nom, description });
      res.status(200).json(collection);
    } else {
      res.status(404).json({ error: 'Collection non trouvée' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour de la collection' });
  }
};

exports.deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findByPk(req.params.id);
    if (collection) {
      await collection.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Collection non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la collection' });
  }
};