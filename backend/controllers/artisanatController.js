const { Artisanat } = require('../models');

exports.getAllArtisanats = async (req, res) => {
  try {
    const artisanats = await Artisanat.findAll({
      include: [{ model: Artisanat.associations.Oeuvre }]
    });
    res.status(200).json(artisanats);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des artisanats' });
  }
};

exports.getArtisanatById = async (req, res) => {
  try {
    const artisanat = await Artisanat.findByPk(req.params.id, {
      include: [{ model: Artisanat.associations.Oeuvre }]
    });
    if (artisanat) {
      res.status(200).json(artisanat);
    } else {
      res.status(404).json({ error: 'Artisanat non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'artisanat' });
  }
};

exports.createArtisanat = async (req, res) => {
  try {
    const { id_oeuvre, materiau } = req.body;
    const newArtisanat = await Artisanat.create({
      id_oeuvre,
      materiau
    });
    res.status(201).json(newArtisanat);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de l\'artisanat' });
  }
};

exports.updateArtisanat = async (req, res) => {
  try {
    const { id_oeuvre, materiau } = req.body;
    const artisanat = await Artisanat.findByPk(req.params.id);
    if (artisanat) {
      await artisanat.update({ id_oeuvre, materiau });
      res.status(200).json(artisanat);
    } else {
      res.status(404).json({ error: 'Artisanat non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour de l\'artisanat' });
  }
};

exports.deleteArtisanat = async (req, res) => {
  try {
    const artisanat = await Artisanat.findByPk(req.params.id);
    if (artisanat) {
      await artisanat.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Artisanat non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'artisanat' });
  }
};