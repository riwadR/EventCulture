const Event = require('../models/Event');

// Créer un nouvel événement
const createEvent = async (req, res) => {
  try {
    const { type, titre, description, dateDebut, dateFin, id_lieu, id_createur } = req.body;

    const newEvent = await Event.create({
      type,
      titre,
      description,
      dateDebut,
      dateFin,
      id_lieu,
      id_createur,
    });

    res.status(201).json({ message: 'Événement créé avec succès', event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Obtenir tous les événements
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des événements' });
  }
};

// Obtenir un événement par son ID
const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Erreur lors de la récupération de l'événement.`});
  }
};

//  Supprimer un évènement
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Évènement non trouvé." });

    await event.destroy();
    res.status(204).json({ message: "Évènement supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un évènement
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Évènement non trouvé." });

    await event.update(req.body);
    res.status(200).json({message: "Évènement mis à jour avec succès. \n" + event});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  deleteEvent,
  updateEvent
};
