const { ParcoursLieux } = require('../models');

exports.getAllParcoursLieux = async (req, res) => {
  try {
    const parcoursLieux = await ParcoursLieux.findAll({
      include: [
        { model: ParcoursLieux.associations.Parcours },
        { model: ParcoursLieux.associations.Lieu },
        { model: ParcoursLieux.associations.Evenement }
      ]
    });
    res.status(200).json(parcoursLieux);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des parcours-lieux' });
  }
};

exports.getParcoursLieuById = async (req, res) => {
  try {
    const parcoursLieu = await ParcoursLieux.findByPk(req.params.id, {
      include: [
        { model: ParcoursLieux.associations.Parcours },
        { model: ParcoursLieux.associations.Lieu },
        { model: ParcoursLieux.associations.Evenement }
      ]
    });
    if (parcoursLieu) {
      res.status(200).json(parcoursLieu);
    } else {
      res.status(404).json({ error: 'Parcours-lieu non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du parcours-lieu' });
  }
};

exports.createParcoursLieu = async (req, res) => {
  try {
    const { id_parcours, id_lieu, id_evenement, ordre } = req.body;
    const newParcoursLieu = await ParcoursLieux.create({
      id_parcours,
      id_lieu,
      id_evenement,
      ordre
    });
    res.status(201).json(newParcoursLieu);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création du parcours-lieu' });
  }
};

exports.updateParcoursLieu = async (req, res) => {
  try {
    const { id_parcours, id_lieu, id_evenement, ordre } = req.body;
    const parcoursLieu = await ParcoursLieux.findByPk(req.params.id);
    if (parcoursLieu) {
      await parcoursLieu.update({
        id_parcours,
        id_lieu,
        id_evenement,
        ordre
      });
      res.status(200).json(parcoursLieu);
    } else {
      res.status(404).json({ error: 'Parcours-lieu non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour du parcours-lieu' });
  }
};

exports.deleteParcoursLieu = async (req, res) => {
  try {
    const parcoursLieu = await ParcoursLieux.findByPk(req.params.id);
    if (parcoursLieu) {
      await parcoursLieu.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Parcours-lieu non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du parcours-lieu' });
  }
};