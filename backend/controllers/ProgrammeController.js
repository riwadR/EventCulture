const Programme = require('../models/Programme');

const createProgramme = async (req, res) => {
  try {
    // Extraire les données du corps de la requête
    const { titre, description, date_heure, id_event } = req.body;

    // Vérifier que tous les champs requis sont présents
    if (!titre || !description || !date_heure || !id_event) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    // Créer le programme dans la base de données
    const programme = await Programme.create({
      titre,
      description,
      date_heure,
      id_event,
    });

    // Retourner le programme créé
    return res.status(201).json(programme);
  } catch (error) {
    // Gérer les erreurs
    return res.status(500).json({ message: error.message });
  }
};

// Récupérer la liste des programmes
const getAllProgrammes = async (req, res) => {
  try {
    const programmes = await Programme.findAll();
    return res.status(200).json(programmes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Récupérer un programme par son id
const getProgrammeByPk = async (req, res) => {
  try {
    const programmes = await Programme.findByPk(req.params.id);
    return res.status(200).json(programmes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un programme
const updateProgramme = async (req, res) => {
  try {
    const programme = await Programme.findByPk(req.params.id);
    if (!programme) return res.status(404).json({ error: "Programme non trouvé." });

    await programme.update(req.body);
    res.status(200).json({message: "Programme mis à jour avec succès. \n" + programme});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un programme
const deleteProgramme = async (req, res) => {
  try {
    const programme = await Programme.findByPk(req.params.id);
    if (!programme) return res.status(404).json({ error: "Programme non trouvé." });

    await programme.destroy();
    res.status(204).json({ message: "Programme supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProgrammeByPk,
  getAllProgrammes,
  updateProgramme,
  deleteProgramme,
  createProgramme
}
