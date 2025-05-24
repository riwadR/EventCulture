const { OeuvreArt } = require('../models');

exports.getAllOeuvreArts = async (req, res) => {
  try {
    const oeuvreArts = await OeuvreArt.findAll({
      include: [{ model: OeuvreArt.associations.Oeuvre }]
    });
    res.status(200).json(oeuvreArts);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des œuvres d\'art' });
  }
};

exports.getOeuvreArtById = async (req, res) => {
  try {
    const oeuvreArt = await OeuvreArt.findByPk(req.params.id, {
      include: [{ model: OeuvreArt.associations.Oeuvre }]
    });
    if (oeuvreArt) {
      res.status(200).json(oeuvreArt);
    } else {
      res.status(404).json({ error: 'Œuvre d\'art non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'œuvre d\'art' });
  }
};

exports.createOeuvreArt = async (req, res) => {
  try {
    const { id_oeuvre, technique } = req.body;
    const newOeuvreArt = await OeuvreArt.create({
      id_oeuvre,
      technique
    });
    res.status(201).json(newOeuvreArt);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de l\'œuvre d\'art' });
  }
};

exports.updateOeuvreArt = async (req, res) => {
  try {
    const { id_oeuvre, technique } = req.body;
    const oeuvreArt = await OeuvreArt.findByPk(req.params.id);
    if (oeuvreArt) {
      await oeuvreArt.update({ id_oeuvre, technique });
      res.status(200).json(oeuvreArt);
    } else {
      res.status(404).json({ error: 'Œuvre d\'art non trouvée' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour de l\'œuvre d\'art' });
  }
};

exports.deleteOeuvreArt = async (req, res) => {
  try {
    const oeuvreArt = await OeuvreArt.findByPk(req.params.id);
    if (oeuvreArt) {
      await oeuvreArt.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Œuvre d\'art non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'œuvre d\'art' });
  }
};