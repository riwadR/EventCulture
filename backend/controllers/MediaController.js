const Media = require('../models/Media');

// Créer un nouveau média
const createMedia = async (req, res) => {
  try {
    const { id_event, id_programme, id_catalog, type_media, url_media } = req.body;
    const newMedia = await Media.create({ id_event, id_programme, id_catalog, type_media, url_media });
    res.status(201).json({ message: 'Média créé avec succès', media: newMedia });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création du média' });
  }
};

// Obtenir tous les médias
const getAllMedia = async (req, res) => {
  try {
    const media = await Media.findAll();
    res.status(200).json(media);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des médias' });
  }
};

// Obtenir un média par son ID
const getMediaById = async (req, res) => {
  const { id } = req.params;
  try {
    const media = await Media.findByPk(id);
    if (!media) {
      return res.status(404).json({ message: 'Média non trouvé' });
    }
    res.status(200).json(media);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du média' });
  }
};

// Supprimer un média
const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findByPk(req.params.id);
    if (!media) return res.status(404).json({ error: 'Média non trouvé.' });

    await media.destroy();
    res.status(204).json({ message: 'Média supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un média
const updateMedia = async (req, res) => {
  try {
    const media = await Media.findByPk(req.params.id);
    if (!media) return res.status(404).json({ error: 'Média non trouvé.' });

    await media.update(req.body);
    res.status(200).json({ message: 'Média mis à jour avec succès', media });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createMedia,
  getAllMedia,
  getMediaById,
  deleteMedia,
  updateMedia,
};
