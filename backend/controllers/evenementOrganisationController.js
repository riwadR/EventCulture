const { EvenementOrganisation } = require('../models');

exports.getAllEvenementOrganisations = async (req, res) => {
  try {
    const evenementOrganisations = await EvenementOrganisation.findAll({
      include: [
        { model: EvenementOrganisation.associations.Evenement },
        { model: EvenementOrganisation.associations.Organisation }
      ]
    });
    res.status(200).json(evenementOrganisations);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des relations événement-organisation' });
  }
};

exports.getEvenementOrganisationById = async (req, res) => {
  try {
    const evenementOrganisation = await EvenementOrganisation.findByPk(req.params.id, {
      include: [
        { model: EvenementOrganisation.associations.Evenement },
        { model: EvenementOrganisation.associations.Organisation }
      ]
    });
    if (evenementOrganisation) {
      res.status(200).json(evenementOrganisation);
    } else {
      res.status(404).json({ error: 'Relation événement-organisation non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la relation événement-organisation' });
  }
};

exports.createEvenementOrganisation = async (req, res) => {
  try {
    const { id_evenement, id_organisation, role } = req.body;
    const newEvenementOrganisation = await EvenementOrganisation.create({
      id_evenement,
      id_organisation,
      role
    });
    res.status(201).json(newEvenementOrganisation);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de la relation événement-organisation' });
  }
};

exports.updateEvenementOrganisation = async (req, res) => {
  try {
    const { id_evenement, id_organisation, role } = req.body;
    const evenementOrganisation = await EvenementOrganisation.findByPk(req.params.id);
    if (evenementOrganisation) {
      await evenementOrganisation.update({
        id_evenement,
        id_organisation,
        role
      });
      res.status(200).json(evenementOrganisation);
    } else {
      res.status(404).json({ error: 'Relation événement-organisation non trouvée' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour de la relation événement-organisation' });
  }
};

exports.deleteEvenementOrganisation = async (req, res) => {
  try {
    const evenementOrganisation = await EvenementOrganisation.findByPk(req.params.id);
    if (evenementOrganisation) {
      await evenementOrganisation.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Relation événement-organisation non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la relation événement-organisation' });
  }
};