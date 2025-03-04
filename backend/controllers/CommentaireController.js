const Commentaire = require('../models/Commentaire');

// Créer un nouveau commentaire
const createCommentaire = async (req, res) => {
  try {
    const { id_user, id_event, commentaire, date_commentaire } = req.body;
    const newCommentaire = await Commentaire.create({ id_user, id_event, commentaire, date_commentaire });
    res.status(201).json({ message: 'Commentaire créé avec succès', commentaire: newCommentaire });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création du commentaire' });
  }
};

// Obtenir tous les commentaires
const getAllCommentaires = async (req, res) => {
  try {
    const commentaires = await Commentaire.findAll();
    res.status(200).json(commentaires);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des commentaires' });
  }
};

// Obtenir un commentaire par son ID
const getCommentaireById = async (req, res) => {
  const { id } = req.params;
  try {
    const commentaire = await Commentaire.findByPk(id);
    if (!commentaire) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }
    res.status(200).json(commentaire);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du commentaire' });
  }
};

// Supprimer un commentaire
const deleteCommentaire = async (req, res) => {
  try {
    const commentaire = await Commentaire.findByPk(req.params.id);
    if (!commentaire) return res.status(404).json({ error: 'Commentaire non trouvé.' });

    await commentaire.destroy();
    res.status(204).json({ message: 'Commentaire supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un commentaire
const updateCommentaire = async (req, res) => {
  try {
    const commentaire = await Commentaire.findByPk(req.params.id);
    if (!commentaire) return res.status(404).json({ error: 'Commentaire non trouvé.' });

    await commentaire.update(req.body);
    res.status(200).json({ message: 'Commentaire mis à jour avec succès', commentaire });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createCommentaire,
  getAllCommentaires,
  getCommentaireById,
  deleteCommentaire,
  updateCommentaire,
};
