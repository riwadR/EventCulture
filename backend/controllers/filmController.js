const { Film } = require('../models');

exports.getAllFilms = async (req, res) => {
  try {
    const films = await Film.findAll({
      include: [{ model: Film.associations.Oeuvre }]
    });
    res.status(200).json(films);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des films' });
  }
};

exports.getFilmById = async (req, res) => {
  try {
    const film = await Film.findByPk(req.params.id, {
      include: [{ model: Film.associations.Oeuvre }]
    });
    if (film) {
      res.status(200).json(film);
    } else {
      res.status(404).json({ error: 'Film non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du film' });
  }
};

exports.createFilm = async (req, res) => {
  try {
    const { id_oeuvre, duree_minutes, realisateur } = req.body;
    const newFilm = await Film.create({
      id_oeuvre,
      duree_minutes,
      realisateur
    });
    res.status(201).json(newFilm);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création du film' });
  }
};

exports.updateFilm = async (req, res) => {
  try {
    const { id_oeuvre, duree_minutes, realisateur } = req.body;
    const film = await Film.findByPk(req.params.id);
    if (film) {
      await film.update({ id_oeuvre, duree_minutes, realisateur });
      res.status(200).json(film);
    } else {
      res.status(404).json({ error: 'Film non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour du film' });
  }
};

exports.deleteFilm = async (req, res) => {
  try {
    const film = await Film.findByPk(req.params.id);
    if (film) {
      await film.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Film non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du film' });
  }
};