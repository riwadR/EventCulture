const { TagMotCle } = require('../models');

exports.getAllTagMotCles = async (req, res) => {
  try {
    const tagMotCles = await TagMotCle.findAll();
    res.status(200).json(tagMotCles);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des tags/mots-clés' });
  }
};

exports.getTagMotCleById = async (req, res) => {
  try {
    const tagMotCle = await TagMotCle.findByPk(req.params.id);
    if (tagMotCle) {
      res.status(200).json(tagMotCle);
    } else {
      res.status(404).json({ error: 'Tag/mot-clé non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du tag/mot-clé' });
  }
};

exports.createTagMotCle = async (req, res) => {
  try {
    const { mot_cle, type } = req.body;
    const newTagMotCle = await TagMotCle.create({
      mot_cle,
      type
    });
    res.status(201).json(newTagMotCle);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création du tag/mot-clé' });
  }
};

exports.updateTagMotCle = async (req, res) => {
  try {
    const { mot_cle, type } = req.body;
    const tagMotCle = await TagMotCle.findByPk(req.params.id);
    if (tagMotCle) {
      await tagMotCle.update({ mot_cle, type });
      res.status(200).json(tagMotCle);
    } else {
      res.status(404).json({ error: 'Tag/mot-clé non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour du tag/mot-clé' });
  }
};

exports.deleteTagMotCle = async (req, res) => {
  try {
    const tagMotCle = await TagMotCle.findByPk(req.params.id);
    if (tagMotCle) {
      await tagMotCle.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Tag/mot-clé non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du tag/mot-clé' });
  }
};