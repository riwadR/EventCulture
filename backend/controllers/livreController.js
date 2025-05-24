const { Livre } = require('../models');

exports.getAllLivres = async (req, res) => {
  try {
    const livres = await Livre.findAll({
      include: [{ model: Livre.associations.Oeuvre }]
    });
    res.status(200).json(livres);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des livres' });
  }
};

exports.getLivreById = async (req, res) => {
  try {
    const livre = await Livre.findByPk(req.params.id, {
      include: [{ model: Livre.associations.Oeuvre }]
    });
    if (livre) {
      res.status(200).json(livre);
    } else {
      res.status(404).json({ error: 'Livre non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du livre' });
  }
};

exports.createLivre = async (req, res) => {
  try {
    const { id_oeuvre, isbn, nb_pages } = req.body;
    const newLivre = await Livre.create({
      id_oeuvre,
      isbn,
      nb_pages
    });
    res.status(201).json(newLivre);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création du livre' });
  }
};

exports.updateLivre = async (req, res) => {
  try {
    const { id_oeuvre, isbn, nb_pages } = req.body;
    const livre = await Livre.findByPk(req.params.id);
    if (livre) {
      await livre.update({ id_oeuvre, isbn, nb_pages });
      res.status(200).json(livre);
    } else {
      res.status(404).json({ error: 'Livre non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour du livre' });
  }
};

exports.deleteLivre = async (req, res) => {
  try {
    const livre = await Livre.findByPk(req.params.id);
    if (livre) {
      await livre.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Livre non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du livre' });
  }
};