const { Evenement } = require('../models');

exports.getAllEvenements = async (req, res) => {
  try {
    const evenements = await Evenement.findAll({
      include: [
        { model: Evenement.associations.Lieu },
        { model: Evenement.associations.User },
        { model: Evenement.associations.TypeEvenement },
        { model: Evenement.associations.Participants, through: { attributes: [] } },
        { model: Evenement.associations.OeuvresPresentation, through: { attributes: [] } },
        { model: Evenement.associations.Programme }
      ]
    });
    res.status(200).json(evenements);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des événements' });
  }
};

exports.getEvenementById = async (req, res) => {
  try {
    const evenement = await Evenement.findByPk(req.params.id, {
      include: [
        { model: Evenement.associations.Lieu },
        { model: Evenement.associations.User },
        { model: Evenement.associations.TypeEvenement },
        { model: Evenement.associations.Participants, through: { attributes: [] } },
        { model: Evenement.associations.OeuvresPresentation, through: { attributes: [] } },
        { model: Evenement.associations.Programme }
      ]
    });
    if (evenement) {
      res.status(200).json(evenement);
    } else {
      res.status(404).json({ error: 'Événement non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'événement' });
  }
};

exports.createEvenement = async (req, res) => {
  try {
    const { nom_evenement, description, date_debut, date_fin, contact_email, contact_telephone, image_url, id_lieu, id_user, id_type_evenement } = req.body;
    const newEvenement = await Evenement.create({
      nom_evenement,
      description,
      date_debut,
      date_fin,
      contact_email,
      contact_telephone,
      image_url,
      id_lieu,
      id_user,
      id_type_evenement
    });
    res.status(201).json(newEvenement);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de l\'événement' });
  }
};

exports.updateEvenement = async (req, res) => {
  try {
    const { nom_evenement, description, date_debut, date_fin, contact_email, contact_telephone, image_url, id_lieu, id_user, id_type_evenement } = req.body;
    const evenement = await Evenement.findByPk(req.params.id);
    if (evenement) {
      await evenement.update({
        nom_evenement,
        description,
        date_debut,
        date_fin,
        contact_email,
        contact_telephone,
        image_url,
        id_lieu,
        id_user,
        id_type_evenement
      });
      res.status(200).json(evenement);
    } else {
      res.status(404).json({ error: 'Événement non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour de l\'événement' });
  }
};

exports.deleteEvenement = async (req, res) => {
  try {
    const evenement = await Evenement.findByPk(req.params.id);
    if (evenement) {
      await evenement.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Événement non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'événement' });
  }
};