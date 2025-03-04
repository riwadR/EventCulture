const Participant = require('../models/Participant');

// Créer un nouveau participant
const createParticipant = async (req, res) => {
  try {
    const { id_user, id_event, statut, date_inscription } = req.body;
    const newParticipant = await Participant.create({ id_user, id_event, statut, date_inscription });
    res.status(201).json({ message: 'Participant créé avec succès', participant: newParticipant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création du participant' });
  }
};

// Obtenir tous les participants
const getAllParticipants = async (req, res) => {
  try {
    const participants = await Participant.findAll();
    res.status(200).json(participants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des participants' });
  }
};

// Obtenir un participant par son ID
const getParticipantById = async (req, res) => {
  const { id } = req.params;
  try {
    const participant = await Participant.findByPk(id);
    if (!participant) {
      return res.status(404).json({ message: 'Participant non trouvé' });
    }
    res.status(200).json(participant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du participant' });
  }
};

// Supprimer un participant
const deleteParticipant = async (req, res) => {
  try {
    const participant = await Participant.findByPk(req.params.id);
    if (!participant) return res.status(404).json({ error: 'Participant non trouvé.' });

    await participant.destroy();
    res.status(204).json({ message: 'Participant supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un participant
const updateParticipant = async (req, res) => {
  try {
    const participant = await Participant.findByPk(req.params.id);
    if (!participant) return res.status(404).json({ error: 'Participant non trouvé.' });

    await participant.update(req.body);
    res.status(200).json({ message: 'Participant mis à jour avec succès', participant });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createParticipant,
  getAllParticipants,
  getParticipantById,
  deleteParticipant,
  updateParticipant,
};
