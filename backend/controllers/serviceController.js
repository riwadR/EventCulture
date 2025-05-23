const { Service, Lieu } = require('../models');

exports.getAllServices = async (req, res) => {
  try {
    // Inclure le lieu associé à chaque service
    const services = await Service.findAll({
      include: [{ model: Lieu }]
    });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des services' });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id, {
      include: [{ model: Lieu }]
    });
    if (service) {
      res.status(200).json(service);
    } else {
      res.status(404).json({ error: 'Service non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du service' });
  }
};

exports.createService = async (req, res) => {
  try {
    const { lieuId, nom } = req.body;
    // Vérifie que le lieu existe (optionnel)
    const lieu = await Lieu.findByPk(lieuId);
    if (!lieu) {
      return res.status(400).json({ error: 'Lieu invalide' });
    }
    const newService = await Service.create({ lieuId, nom });
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création du service' });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { lieuId, nom } = req.body;
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service non trouvé' });
    }
    if (lieuId) {
      const lieu = await Lieu.findByPk(lieuId);
      if (!lieu) {
        return res.status(400).json({ error: 'Lieu invalide' });
      }
    }
    await service.update({ lieuId, nom });
    res.status(200).json(service);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour du service' });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service non trouvé' });
    }
    await service.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du service' });
  }
};
