const { EvenementUser } = require('../models');

exports.getAllEvenementUsers = async (req, res) => {
  try {
    const evenementUsers = await EvenementUser.findAll({
      include: [
        { model: EvenementUser.associations.Evenement },
        { model: EvenementUser.associations.User }
      ]
    });
    res.status(200).json(evenementUsers);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des relations événement-utilisateur' });
  }
};

exports.getEvenementUser = async (req, res) => {
  try {
    const { id_evenement, id_user } = req.params;
    const evenementUser = await EvenementUser.findOne({
      where: { id_evenement, id_user },
      include: [
        { model: EvenementUser.associations.Evenement },
        { model: EvenementUser.associations.User }
      ]
    });
    if (evenementUser) {
      res.status(200).json(evenementUser);
    } else {
      res.status(404).json({ error: 'Relation événement-utilisateur non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la relation événement-utilisateur' });
  }
};

exports.createEvenementUser = async (req, res) => {
  try {
    const { id_evenement, id_user, role_participation, statut_participation, notes } = req.body;
    const newEvenementUser = await EvenementUser.create({
      id_evenement,
      id_user,
      role_participation,
      statut_participation,
      notes
    });
    res.status(201).json(newEvenementUser);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de la relation événement-utilisateur' });
  }
};

exports.updateEvenementUser = async (req, res) => {
  try {
    const { id_evenement, id_user } = req.params;
    const { role_participation, statut_participation, notes } = req.body;
    const evenementUser = await EvenementUser.findOne({
      where: { id_evenement, id_user }
    });
    if (evenementUser) {
      await evenementUser.update({
        role_participation,
        statut_participation,
        notes
      });
      res.status(200).json(evenementUser);
    } else {
      res.status(404).json({ error: 'Relation événement-utilisateur non trouvée' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour de la relation événement-utilisateur' });
  }
};

exports.deleteEvenementUser = async (req, res) => {
  try {
    const { id_evenement, id_user } = req.params;
    const evenementUser = await EvenementUser.findOne({
      where: { id_evenement, id_user }
    });
    if (evenementUser) {
      await evenementUser.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Relation événement-utilisateur non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la relation événement-utilisateur' });
  }
};