const { Wilaya } = require('../models');

exports.getAllWilayas = async (req, res) => {
  try {
    const wilayas = await Wilaya.findAll({
      include: [{ 
        model: require('../models').Daira,
        as: 'Dairas' // Assurez-vous que l'alias correspond à votre association
      }]
    });
    res.status(200).json(wilayas);
  } catch (error) {
    console.error('Erreur getAllWilayas:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des wilayas' });
  }
};

exports.getWilayaById = async (req, res) => {
  try {
    const wilaya = await Wilaya.findByPk(req.params.id, {
      include: [{ 
        model: require('../models').Daira,
        as: 'Dairas' // Assurez-vous que l'alias correspond à votre association
      }]
    });
    if (wilaya) {
      res.status(200).json(wilaya);
    } else {
      res.status(404).json({ error: 'Wilaya non trouvée' });
    }
  } catch (error) {
    console.error('Erreur getWilayaById:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la wilaya' });
  }
};

exports.createWilaya = async (req, res) => {
  try {
    const { id, nom } = req.body;
    
    // Validation des données requises
    if (!id || !nom) {
      return res.status(400).json({ 
        error: 'Les champs id et nom sont obligatoires' 
      });
    }

    // Vérifier si la wilaya existe déjà
    const existingWilaya = await Wilaya.findByPk(id);
    if (existingWilaya) {
      return res.status(409).json({ 
        error: 'Une wilaya avec cet ID existe déjà' 
      });
    }

    const newWilaya = await Wilaya.create({
      id,
      nom
    });
    res.status(201).json(newWilaya);
  } catch (error) {
    console.error('Erreur createWilaya:', error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ 
        error: 'Données invalides', 
        details: error.errors.map(err => err.message) 
      });
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ error: 'Une wilaya avec cet ID existe déjà' });
    } else {
      res.status(400).json({ error: 'Erreur lors de la création de la wilaya' });
    }
  }
};

exports.updateWilaya = async (req, res) => {
  try {
    const { nom } = req.body;
    
    // Validation des données
    if (!nom) {
      return res.status(400).json({ 
        error: 'Le champ nom est obligatoire' 
      });
    }

    const wilaya = await Wilaya.findByPk(req.params.id);
    if (wilaya) {
      await wilaya.update({ nom });
      res.status(200).json(wilaya);
    } else {
      res.status(404).json({ error: 'Wilaya non trouvée' });
    }
  } catch (error) {
    console.error('Erreur updateWilaya:', error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ 
        error: 'Données invalides', 
        details: error.errors.map(err => err.message) 
      });
    } else {
      res.status(400).json({ error: 'Erreur lors de la mise à jour de la wilaya' });
    }
  }
};

exports.deleteWilaya = async (req, res) => {
  try {
    const wilaya = await Wilaya.findByPk(req.params.id);
    if (wilaya) {
      await wilaya.destroy();
      res.status(204).send(); // Pas de contenu à retourner pour un DELETE réussi
    } else {
      res.status(404).json({ error: 'Wilaya non trouvée' });
    }
  } catch (error) {
    console.error('Erreur deleteWilaya:', error);
    // Vérifier si l'erreur est due à une contrainte de clé étrangère
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(409).json({ 
        error: 'Impossible de supprimer la wilaya car elle contient des daïras' 
      });
    } else {
      res.status(500).json({ error: 'Erreur lors de la suppression de la wilaya' });
    }
  }
};