const Oeuvre = require('../models/Oeuvre');

// Créer une nouvelle oeuvre
const createOeuvre = async (req, res) => {
    try {
        const { titre, type, description, prix, image, id_createur } = req.body;
        const oeuvre = await Oeuvre.create({ titre, type, description, prix, image, id_createur });
        res.status(201).json(oeuvre);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Récupérer la liste des oeuvres
const getAllOeuvres = async (req, res) => {
    try {
        const oeuvres = await Oeuvre.findAll();
        res.status(200).json(oeuvres);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer une oeuvre par son ID
const getOeuvreByPk = async (req, res) => {
    const { id } = req.params;
    try {
      const oeuvre = await Oeuvre.findByPk(id);
  
      if (!oeuvre) {
        return res.status(404).json({ message: 'Oeuvre non trouvée.' });
      }
  
      res.status(200).json({oeuvre});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `Erreur lors de la récupération de l'oeuvre.`});
    }
  };

// Mettre à jour un évènement
const updateOeuvre = async (req, res) => {
    try {
      const oeuvre = await Oeuvre.findByPk(req.params.id);
      if (!oeuvre) return res.status(404).json({ error: "Oeuvre non trouvée." });
  
      await oeuvre.update(req.body);
      res.status(200).json({message: "Oeuvre mise à jour avec succès. \n" + oeuvre});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Supprimer une oeuvre
const deleteOeuvre = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Oeuvre.destroy({ where: { id_oeuvre: id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: "Oeuvre non trouvée" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createOeuvre,
    getAllOeuvres,
    getOeuvreByPk,
    updateOeuvre,
    deleteOeuvre,
};

