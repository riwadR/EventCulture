const Event = require('../models/Event');

// Créer un nouvel événement
const { Evenement, Lieu, User, Oeuvre } = require('../models');

// Créer un nouvel événement (sans participants ni œuvres initiaux)
exports.createEvenement = async (req, res) => {
  try {
    const { nom_evenement, description, date_debut, date_fin, id_lieu } = req.body;

    // Vérifier si le lieu existe
    const lieu = await Lieu.findByPk(id_lieu);
    if (!lieu) {
      return res.status(404).json({ error: 'Lieu non trouvé' });
    }

    // Créer l'événement
    const evenement = await Evenement.create({
      nom_evenement,
      description,
      date_debut,
      date_fin,
      id_lieu
    });

    res.status(201).json(evenement);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'événement', details: error.message });
  }
};

// Ajouter un participant et éventuellement une nouvelle œuvre
exports.addParticipantToEvenement = async (req, res) => {
  try {
    const { id } = req.params; // ID de l'événement
    const { nom, prenom, email, type_personne, oeuvre } = req.body; // oeuvre est optionnel

    const evenement = await Evenement.findByPk(id);
    if (!evenement) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }

    // Vérifier si l'utilisateur existe déjà (par email)
    let user = await User.findOne({ where: { email } });
    if (!user) {
      // Créer un nouvel utilisateur
      user = await User.create({
        nom,
        prenom,
        email,
        type_personne
      });
    }

    // Associer l'utilisateur à l'événement
    await evenement.addParticipant(user.id_user);

    // Si une œuvre est fournie, la créer et l'associer à l'utilisateur et à l'événement
    if (oeuvre) {
      const newOeuvre = await Oeuvre.create({
        titre: oeuvre.titre,
        type_oeuvre: oeuvre.type_oeuvre,
        annee_creation: oeuvre.annee_creation,
        id_user: user.id_user
      });
      await evenement.addOeuvresPresentation(newOeuvre.id_oeuvre);
    }

    res.status(200).json({ message: 'Participant et œuvre ajoutés avec succès', user });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout du participant', details: error.message });
  }
};

// Associer une œuvre existante d’un participant à un événement
exports.addParticipantOeuvreToEvenement = async (req, res) => {
  try {
    const { id, id_user, id_oeuvre } = req.params; // id: événement, id_user: participant, id_oeuvre: œuvre

    const evenement = await Evenement.findByPk(id);
    if (!evenement) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }

    const user = await User.findByPk(id_user);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const oeuvre = await Oeuvre.findByPk(id_oeuvre);
    if (!oeuvre) {
      return res.status(404).json({ error: 'Œuvre non trouvée' });
    }

    // Vérifier que l’œuvre appartient au participant
    if (oeuvre.id_user !== parseInt(id_user)) {
      return res.status(403).json({ error: 'Cette œuvre n\'appartient pas à cet utilisateur' });
    }

    // Vérifier que l’utilisateur est un participant de l’événement
    const isParticipant = await evenement.hasParticipant(id_user);
    if (!isParticipant) {
      return res.status(403).json({ error: 'L\'utilisateur n\'est pas un participant de cet événement' });
    }

    // Associer l’œuvre à l’événement
    await evenement.addOeuvresPresentation(id_oeuvre);

    res.status(200).json({ message: 'Œuvre associée à l\'événement avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'association de l\'œuvre', details: error.message });
  }
};

// Obtenir tous les événements
exports.getAllEvenements = async (req, res) => {
  try {
    const evenements = await Evenement.findAll({
      include: [
        { model: Lieu, attributes: ['id_lieu', 'nom_lieu'] },
        { model: User, as: 'Participants', attributes: ['id_user', 'nom', 'prenom'], through: { attributes: [] } },
        { model: Oeuvre, as: 'OeuvresPresentation', attributes: ['id_oeuvre', 'titre', 'type_oeuvre', 'id_user'], through: { attributes: [] } }
      ]
    });
    res.status(200).json(evenements);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des événements', details: error.message });
  }
};

// Obtenir un événement par ID
exports.getEvenementById = async (req, res) => {
  try {
    const evenement = await Evenement.findByPk(req.params.id, {
      include: [
        { model: Lieu, attributes: ['id_lieu', 'nom_lieu'] },
        { model: User, as: 'Participants', attributes: ['id_user', 'nom', 'prenom'], through: { attributes: [] } },
        { model: Oeuvre, as: 'OeuvresPresentation', attributes: ['id_oeuvre', 'titre', 'type_oeuvre', 'id_user'], through: { attributes: [] } }
      ]
    });
    if (!evenement) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }
    res.status(200).json(evenement);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'événement', details: error.message });
  }
};

// Mettre à jour un événement
exports.updateEvenement = async (req, res) => {
  try {
    const { nom_evenement, description, date_debut, date_fin, id_lieu } = req.body;
    const evenement = await Evenement.findByPk(req.params.id);

    if (!evenement) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }

    // Vérifier si le lieu existe
    if (id_lieu) {
      const lieu = await Lieu.findByPk(id_lieu);
      if (!lieu) {
        return res.status(404).json({ error: 'Lieu non trouvé' });
      }
    }

    // Mettre à jour l'événement
    await evenement.update({
      nom_evenement,
      description,
      date_debut,
      date_fin,
      id_lieu
    });

    res.status(200).json(evenement);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'événement', details: error.message });
  }
};

// Supprimer un événement
exports.deleteEvenement = async (req, res) => {
  try {
    const evenement = await Evenement.findByPk(req.params.id);
    if (!evenement) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }

    await evenement.destroy();
    res.status(204).json({ message: 'Événement supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'événement', details: error.message });
  }
};