const { UserRole } = require('../models');

exports.getAllUserRoles = async (req, res) => {
  try {
    const userRoles = await UserRole.findAll({
      include: [
        { model: UserRole.associations.User },
        { model: UserRole.associations.Role }
      ]
    });
    res.status(200).json(userRoles);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des relations utilisateur-rôle' });
  }
};

exports.getUserRole = async (req, res) => {
  try {
    const { id_user, id_role } = req.params;
    const userRole = await UserRole.findOne({
      where: { id_user, id_role },
      include: [
        { model: UserRole.associations.User },
        { model: UserRole.associations.Role }
      ]
    });
    if (userRole) {
      res.status(200).json(userRole);
    } else {
      res.status(404).json({ error: 'Relation utilisateur-rôle non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la relation utilisateur-rôle' });
  }
};

exports.createUserRole = async (req, res) => {
  try {
    const { id_user, id_role } = req.body;
    const newUserRole = await UserRole.create({
      id_user,
      id_role
    });
    res.status(201).json(newUserRole);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de la relation utilisateur-rôle' });
  }
};

exports.deleteUserRole = async (req, res) => {
  try {
    const { id_user, id_role } = req.params;
    const userRole = await UserRole.findOne({
      where: { id_user, id_role }
    });
    if (userRole) {
      await userRole.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Relation utilisateur-rôle non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la relation utilisateur-rôle' });
  }
};