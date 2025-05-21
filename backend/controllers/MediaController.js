const { Media } = require('../models');

exports.getAllMedia = async (req, res) => {
  try {
    const media = await Media.findAll({
      include: [{ model: Media.associations.Oeuvre }]
    });
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des médias' });
  }
};

exports.getMediaById = async (req, res) => {
  try {
    const media = await Media.findByPk(req.params.id, {
      include: [{ model: Media.associations.Oeuvre }]
    });
    if (media) {
      res.status(200).json(media);
    } else {
      res.status(404).json({ error: 'Média non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du média' });
  }
};

exports.createMedia = async (req, res) => {
  try {
    const { id_oeuvre, type_media, url, description } = req.body;
    const newMedia = await Media.create({
      id_oeuvre,
      type_media,
      url,
      description
    });
    res.status(201).json(newMedia);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création du média' });
  }
};

exports.updateMedia = async (req, res) => {
  try {
    const { id_oeuvre, type_media, url, description } = req.body;
    const media = await Media.findByPk(req.params.id);
    if (media) {
      await media.update({ id_oeuvre, type_media, url, description });
      res.status(200).json(media);
    } else {
      res.status(404).json({ error: 'Média non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour du média' });
  }
};

exports.deleteMedia = async (req, res) => {
  try {
    const media = await Media.findByPk(req.params.id);
    if (media) {
      await media.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Média non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du média' });
  }
};