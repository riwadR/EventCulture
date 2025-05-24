const { OeuvreUser } = require('../models');

exports.getAllOeuvreUsers = async (req, res) => {
  try {
    const oeuvreUsers = await OeuvreUser.findAll({
      include: [
        { model: OeuvreUser.associations.Oeuvre },
        { model: OeuvreUser.associations.User }
      ]
    });
    res.status(200).json(oeuvreUsers);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des relations œuvre-utilisateur' });
  }
};

exports.getOeuvreUser = async (req, res) => {
  try {
    const { id_oeuvre, id_user } = req.params;
    const oeuvreUser = await OeuvreUser.findOne({
      where: { id_oeuvre, id_user },
      include: [
        { model: OeuvreUser.associations.Oeuvre },
        { model: OeuvreUser.associations.User }
      ]
    });
    if (oeuvreUser) {
      res.status(200).json(oeuvreUser);
    } else {
      res.status(404).json({ error: 'Relation œuvre-utilisateur non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la relation œuvre-utilisateur' });
  }
};

exports.createOeuvreUser = async (req, res) => {
  try {
    const { id_oeuvre, id_user, role } = req.body;
    const newOeuvreUser = await OeuvreUser.create({
      id_oeuvre,
      id_user,
      role
    });
    res.status(201).json(newOeuvreUser);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de la relation œuvre-utilisateur' });
  }
};

exports.updateOeuvreUser = async (req, res) => {
  try {
    const { id_oeuvre, id_user } = req.params;
    const { role } = req.body;
    const oeuvreUser = await OeuvreUser.findOne({
      where: { id_oeuvre, id_user }
    });
    if (oeuvreUser) {
      await oeuvreUser.update({ role });
      res.status(200).json(oeuvreUser);
    } else {
      res.status(404).json({ error: 'Relation œuvre-utilisateur non trouvée' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour de la relation œuvre-utilisateur' });
  }
};

exports.deleteOeuvreUser = async (req, res) => {
  try {
    const { id_oeuvre, id_user } = req.params;
    const oeuvreUser = await OeuvreUser.findOne({
      where: { id_oeuvre, id_user }
    });
    if (oeuvreUser) {
      await oeuvreUser.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Relation œuvre-utilisateur non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la relation œuvre-utilisateur' });
  }
};