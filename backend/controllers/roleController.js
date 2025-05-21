const { Role } = require('../models');

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [{ model: Role.associations.User }]
    });
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des rôles' });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id, {
      include: [{ model: Role.associations.User }]
    });
    if (role) {
      res.status(200).json(role);
    } else {
      res.status(404).json({ error: 'Rôle non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du rôle' });
  }
};

exports.createRole = async (req, res) => {
  try {
    const { nom_role, description } = req.body;
    const newRole = await Role.create({
      nom_role,
      description
    });
    res.status(201).json(newRole);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création du rôle' });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { nom_role, description } = req.body;
    const role = await Role.findByPk(req.params.id);
    if (role) {
      await role.update({ nom_role, description });
      res.status(200).json(role);
    } else {
      res.status(404).json({ error: 'Rôle non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour du rôle' });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (role) {
      await role.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Rôle non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du rôle' });
  }
};