const { TypeOeuvre } = require('../models');

exports.getAllTypeOeuvres = async (req, res) => {
  try {
    const typeOeuvres = await TypeOeuvre.findAll({
      include: [{ model: TypeOeuvre.associations.Oeuvre }]
    });
    res.status(200).json(typeOeuvres);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des types d\'oeuvres' });
  }
};

exports.getTypeOeuvreById = async (req, res) => {
  try {
    const typeOeuvre = await TypeOeuvre.findByPk(req.params.id, {
      include: [{ model: TypeOeuvre.associations.Oeuvre }]
    });
    if (typeOeuvre) {
      res.status(200).json(typeOeuvre);
    } else {
      res.status(404).json({ error: 'Type d\'oeuvre non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du type d\'oeuvre' });
  }
};

exports.createTypeOeuvre = async (req, res) => {
  try {
    const { nom_type, description } = req.body;
    const newTypeOeuvre = await TypeOeuvre.create({
      nom_type,
      description
    });
    res.status(201).json(newTypeOeuvre);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création du type d\'oeuvre' });
  }
};

exports.updateTypeOeuvre = async (req, res) => {
  try {
    const { nom_type, description } = req.body;
    const typeOeuvre = await TypeOeuvre.findByPk(req.params.id);
    if (typeOeuvre) {
      await typeOeuvre.update({ nom_type, description });
      res.status(200).json(typeOeuvre);
    } else {
      res.status(404).json({ error: 'Type d\'oeuvre non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour du type d\'oeuvre' });
  }
};

exports.deleteTypeOeuvre = async (req, res) => {
  try {
    const typeOeuvre = await TypeOeuvre.findByPk(req.params.id);
    if (typeOeuvre) {
      await typeOeuvre.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Type d\'oeuvre non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du type d\'oeuvre' });
  }
};