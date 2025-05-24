const { OeuvreCategorie } = require('../models');

exports.getAllOeuvreCategories = async (req, res) => {
  try {
    const oeuvreCategories = await OeuvreCategorie.findAll({
      include: [
        { model: OeuvreCategorie.associations.Oeuvre },
        { model: OeuvreCategorie.associations.Categorie }
      ]
    });
    res.status(200).json(oeuvreCategories);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des relations œuvre-catégorie' });
  }
};

exports.getOeuvreCategorie = async (req, res) => {
  try {
    const { id_oeuvre, id_categorie } = req.params;
    const oeuvreCategorie = await OeuvreCategorie.findOne({
      where: { id_oeuvre, id_categorie },
      include: [
        { model: OeuvreCategorie.associations.Oeuvre },
        { model: OeuvreCategorie.associations.Categorie }
      ]
    });
    if (oeuvreCategorie) {
      res.status(200).json(oeuvreCategorie);
    } else {
      res.status(404).json({ error: 'Relation œuvre-catégorie non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la relation œuvre-catégorie' });
  }
};

exports.createOeuvreCategorie = async (req, res) => {
  try {
    const { id_oeuvre, id_categorie } = req.body;
    const newOeuvreCategorie = await OeuvreCategorie.create({
      id_oeuvre,
      id_categorie
    });
    res.status(201).json(newOeuvreCategorie);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de la relation œuvre-catégorie' });
  }
};

exports.deleteOeuvreCategorie = async (req, res) => {
  try {
    const { id_oeuvre, id_categorie } = req.params;
    const oeuvreCategorie = await OeuvreCategorie.findOne({
      where: { id_oeuvre, id_categorie }
    });
    if (oeuvreCategorie) {
      await oeuvreCategorie.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Relation œuvre-catégorie non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la relation œuvre-catégorie' });
  }
};