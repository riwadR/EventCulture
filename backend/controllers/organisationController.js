const { Organisation } = require('../models');

exports.getAllOrganisations = async (req, res) => {
  try {
    const organisations = await Organisation.findAll({
      include: [{ model: Organisation.associations.Evenements }]
    });
    res.status(200).json(organisations);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des organisations' });
  }
};

exports.getOrganisationById = async (req, res) => {
  try {
    const organisation = await Organisation.findByPk(req.params.id, {
      include: [{ model: Organisation.associations.Evenements }]
    });
    if (organisation) {
      res.status(200).json(organisation);
    } else {
      res.status(404).json({ error: 'Organisation non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'organisation' });
  }
};

exports.createOrganisation = async (req, res) => {
  try {
    const { nom, description, site_web } = req.body;
    const newOrganisation = await Organisation.create({
      nom,
      description,
      site_web
    });
    res.status(201).json(newOrganisation);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de l\'organisation' });
  }
};

exports.updateOrganisation = async (req, res) => {
  try {
    const { nom, description, site_web } = req.body;
    const organisation = await Organisation.findByPk(req.params.id);
    if (organisation) {
      await organisation.update({ nom, description, site_web });
      res.status(200).json(organisation);
    } else {
      res.status(404).json({ error: 'Organisation non trouvée' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour de l\'organisation' });
  }
};

exports.deleteOrganisation = async (req, res) => {
  try {
    const organisation = await Organisation.findByPk(req.params.id);
    if (organisation) {
      await organisation.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Organisation non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'organisation' });
  }
};