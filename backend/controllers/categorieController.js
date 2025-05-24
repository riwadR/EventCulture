const { Categorie } = require('../models');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Categorie.findAll({
      include: [{ model: Categorie.associations.Oeuvres, through: { attributes: [] } }]
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
  }
};

exports.getCategorieById = async (req, res) => {
  try {
    const categorie = await Categorie.findByPk(req.params.id, {
      include: [{ model: Categorie.associations.Oeuvres, through: { attributes: [] } }]
    });
    if (categorie) {
      res.status(200).json(categorie);
    } else {
      res.status(404).json({ error: 'Catégorie non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la catégorie' });
  }
};

exports.createCategorie = async (req, res) => {
  try {
    const { nom, description } = req.body;
    const newCategorie = await Categorie.create({
      nom,
      description
    });
    res.status(201).json(newCategorie);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de la catégorie' });
  }
};

exports.updateCategorie = async (req, res) => {
  try {
    const { nom, description } = req.body;
    const categorie = await Categorie.findByPk(req.params.id);
    if (categorie) {
      await categorie.update({ nom, description });
      res.status(200).json(categorie);
    } else {
      res.status(404).json({ error: 'Catégorie non trouvée' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour de la catégorie' });
  }
};

exports.deleteCategorie = async (req, res) => {
  try {
    const categorie = await Categorie.findByPk(req.params.id);
    if (categorie) {
      await categorie.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Catégorie non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la catégorie' });
  }
};