const Catalogue = require('../models/Catalogue');

// Créer un nouveau catalogue
const createCatalogue = async (req, res) => {
  try {
    const { id_event, nom, description } = req.body;
    const newCatalogue = await Catalogue.create({ id_event, nom, description });
    res.status(201).json({ message: 'Catalogue créé avec succès', catalogue: newCatalogue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création du catalogue' });
  }
};

// Obtenir tous les catalogues
const getAllCatalogues = async (req, res) => {
  try {
    const catalogues = await Catalogue.findAll();
    res.status(200).json(catalogues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des catalogues' });
  }
};

// Obtenir un catalogue par son ID
const getCatalogueById = async (req, res) => {
  const { id } = req.params;
  try {
    const catalogue = await Catalogue.findByPk(id);
    if (!catalogue) {
      return res.status(404).json({ message: 'Catalogue non trouvé' });
    }
    res.status(200).json(catalogue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du catalogue' });
  }
};

// Supprimer un catalogue
const deleteCatalogue = async (req, res) => {
  try {
    const catalogue = await Catalogue.findByPk(req.params.id);
    if (!catalogue) return res.status(404).json({ error: 'Catalogue non trouvé.' });

    await catalogue.destroy();
    res.status(204).json({ message: 'Catalogue supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un catalogue
const updateCatalogue = async (req, res) => {
  try {
    const catalogue = await Catalogue.findByPk(req.params.id);
    if (!catalogue) return res.status(404).json({ error: 'Catalogue non trouvé.' });

    await catalogue.update(req.body);
    res.status(200).json({ message: 'Catalogue mis à jour avec succès', catalogue });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createCatalogue,
  getAllCatalogues,
  getCatalogueById,
  deleteCatalogue,
  updateCatalogue
};
