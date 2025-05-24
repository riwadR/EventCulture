const { AlbumMusical } = require('../models');

exports.getAllAlbums = async (req, res) => {
  try {
    const albums = await AlbumMusical.findAll({
      include: [{ model: AlbumMusical.associations.Oeuvre }]
    });
    res.status(200).json(albums);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des albums' });
  }
};

exports.getAlbumById = async (req, res) => {
  try {
    const album = await AlbumMusical.findByPk(req.params.id, {
      include: [{ model: AlbumMusical.associations.Oeuvre }]
    });
    if (album) {
      res.status(200).json(album);
    } else {
      res.status(404).json({ error: 'Album non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'album' });
  }
};

exports.createAlbum = async (req, res) => {
  try {
    const { id_oeuvre, genre, duree } = req.body;
    const newAlbum = await AlbumMusical.create({
      id_oeuvre,
      genre,
      duree
    });
    res.status(201).json(newAlbum);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de l\'album' });
  }
};

exports.updateAlbum = async (req, res) => {
  try {
    const { id_oeuvre, genre, duree } = req.body;
    const album = await AlbumMusical.findByPk(req.params.id);
    if (album) {
      await album.update({ id_oeuvre, genre, duree });
      res.status(200).json(album);
    } else {
      res.status(404).json({ error: 'Album non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour de l\'album' });
  }
};

exports.deleteAlbum = async (req, res) => {
  try {
    const album = await AlbumMusical.findByPk(req.params.id);
    if (album) {
      await album.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Album non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'album' });
  }
};