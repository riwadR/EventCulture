const { DetailLieu, Lieu, Monument, Vestige } = require('../models');

exports.getAllDetailLieux = async (req, res) => {
  try {
    const detailLieux = await DetailLieu.findAll({
      include: [
        { 
          model: Lieu,
          attributes: ['id', 'nom', 'typeLieu', 'adresse', 'latitude', 'longitude']
        },
        { 
          model: Monument, 
          required: false 
        },
        { 
          model: Vestige, 
          required: false 
        }
      ]
    });
    
    res.status(200).json(detailLieux);
  } catch (error) {
    console.error('Erreur getAllDetailLieux:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des détails des lieux' });
  }
};

exports.getDetailLieuById = async (req, res) => {
  try {
    const detailLieu = await DetailLieu.findByPk(req.params.id, {
      include: [
        { 
          model: Lieu,
          attributes: ['id', 'nom', 'typeLieu', 'adresse', 'latitude', 'longitude']
        },
        { 
          model: Monument, 
          required: false 
        },
        { 
          model: Vestige, 
          required: false 
        }
      ]
    });

    if (detailLieu) {
      res.status(200).json(detailLieu);
    } else {
      res.status(404).json({ error: 'Détail du lieu non trouvé' });
    }
  } catch (error) {
    console.error('Erreur getDetailLieuById:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du détail du lieu' });
  }
};

exports.createDetailLieu = async (req, res) => {
  try {
    const {
      lieuId,
      description,
      horaires,
      histoire,
      referencesHistoriques,
      noteMoyenne
    } = req.body;

    // Validation des champs obligatoires
    if (!lieuId) {
      return res.status(400).json({
        error: 'Le champ lieuId est obligatoire'
      });
    }

    // Vérifier si le lieu existe
    const lieu = await Lieu.findByPk(lieuId);
    if (!lieu) {
      return res.status(400).json({
        error: 'Le lieu spécifié n\'existe pas'
      });
    }

    // Vérifier si un détail existe déjà pour ce lieu
    const existingDetail = await DetailLieu.findByPk(lieuId);
    if (existingDetail) {
      return res.status(409).json({
        error: 'Un détail existe déjà pour ce lieu'
      });
    }

    // Validation de la note moyenne
    if (noteMoyenne !== undefined && noteMoyenne !== null) {
      if (isNaN(noteMoyenne) || noteMoyenne < 0 || noteMoyenne > 5) {
        return res.status(400).json({
          error: 'La note moyenne doit être un nombre entre 0 et 5'
        });
      }
    }

    const newDetailLieu = await DetailLieu.create({
      lieuId,
      description,
      horaires,
      histoire,
      referencesHistoriques,
      noteMoyenne
    });

    // Récupérer le détail créé avec ses relations
    const detailLieuWithRelations = await DetailLieu.findByPk(newDetailLieu.lieuId, {
      include: [
        { 
          model: Lieu,
          attributes: ['id', 'nom', 'typeLieu', 'adresse', 'latitude', 'longitude']
        }
      ]
    });

    res.status(201).json(detailLieuWithRelations);
  } catch (error) {
    console.error('Erreur createDetailLieu:', error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({
        error: 'Données invalides',
        details: error.errors.map(err => err.message)
      });
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ error: 'Un détail existe déjà pour ce lieu' });
    } else {
      res.status(400).json({ error: 'Erreur lors de la création du détail du lieu' });
    }
  }
};

exports.updateDetailLieu = async (req, res) => {
  try {
    const {
      description,
      horaires,
      histoire,
      referencesHistoriques,
      noteMoyenne
    } = req.body;

    const detailLieu = await DetailLieu.findByPk(req.params.id);
    if (!detailLieu) {
      return res.status(404).json({ error: 'Détail du lieu non trouvé' });
    }

    // Validation de la note moyenne si fournie
    if (noteMoyenne !== undefined && noteMoyenne !== null) {
      if (isNaN(noteMoyenne) || noteMoyenne < 0 || noteMoyenne > 5) {
        return res.status(400).json({
          error: 'La note moyenne doit être un nombre entre 0 et 5'
        });
      }
    }

    // Mise à jour des champs
    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (horaires !== undefined) updateData.horaires = horaires;
    if (histoire !== undefined) updateData.histoire = histoire;
    if (referencesHistoriques !== undefined) updateData.referencesHistoriques = referencesHistoriques;
    if (noteMoyenne !== undefined) updateData.noteMoyenne = noteMoyenne;

    await detailLieu.update(updateData);

    // Récupérer le détail mis à jour avec ses relations
    const updatedDetailLieu = await DetailLieu.findByPk(detailLieu.lieuId, {
      include: [
        { 
          model: Lieu,
          attributes: ['id', 'nom', 'typeLieu', 'adresse', 'latitude', 'longitude']
        },
        { 
          model: Monument, 
          required: false 
        },
        { 
          model: Vestige, 
          required: false 
        }
      ]
    });

    res.status(200).json(updatedDetailLieu);
  } catch (error) {
    console.error('Erreur updateDetailLieu:', error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({
        error: 'Données invalides',
        details: error.errors.map(err => err.message)
      });
    } else {
      res.status(400).json({ error: 'Erreur lors de la mise à jour du détail du lieu' });
    }
  }
};

exports.deleteDetailLieu = async (req, res) => {
  try {
    const detailLieu = await DetailLieu.findByPk(req.params.id);
    if (detailLieu) {
      await detailLieu.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Détail du lieu non trouvé' });
    }
  } catch (error) {
    console.error('Erreur deleteDetailLieu:', error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(409).json({
        error: 'Impossible de supprimer le détail car il est référencé par d\'autres entités (monuments, vestiges)'
      });
    } else {
      res.status(500).json({ error: 'Erreur lors de la suppression du détail du lieu' });
    }
  }
};

// Méthodes utilitaires supplémentaires

exports.getDetailLieuxByNote = async (req, res) => {
  try {
    const { noteMin = 0, noteMax = 5 } = req.query;
    
    const noteMinFloat = parseFloat(noteMin);
    const noteMaxFloat = parseFloat(noteMax);

    if (isNaN(noteMinFloat) || isNaN(noteMaxFloat)) {
      return res.status(400).json({
        error: 'Les paramètres noteMin et noteMax doivent être des nombres valides'
      });
    }

    if (noteMinFloat < 0 || noteMinFloat > 5 || noteMaxFloat < 0 || noteMaxFloat > 5) {
      return res.status(400).json({
        error: 'Les notes doivent être comprises entre 0 et 5'
      });
    }

    if (noteMinFloat > noteMaxFloat) {
      return res.status(400).json({
        error: 'La note minimum ne peut pas être supérieure à la note maximum'
      });
    }

    const detailLieux = await DetailLieu.findAll({
      where: {
        noteMoyenne: {
          [require('sequelize').Op.between]: [noteMinFloat, noteMaxFloat]
        }
      },
      include: [
        { 
          model: Lieu,
          attributes: ['id', 'nom', 'typeLieu', 'adresse', 'latitude', 'longitude']
        }
      ],
      order: [['noteMoyenne', 'DESC']]
    });

    res.status(200).json(detailLieux);
  } catch (error) {
    console.error('Erreur getDetailLieuxByNote:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des détails par note' });
  }
};

exports.updateNoteMoyenne = async (req, res) => {
  try {
    const { noteMoyenne } = req.body;

    if (noteMoyenne === undefined || noteMoyenne === null) {
      return res.status(400).json({
        error: 'Le champ noteMoyenne est obligatoire'
      });
    }

    if (isNaN(noteMoyenne) || noteMoyenne < 0 || noteMoyenne > 5) {
      return res.status(400).json({
        error: 'La note moyenne doit être un nombre entre 0 et 5'
      });
    }

    const detailLieu = await DetailLieu.findByPk(req.params.id);
    if (!detailLieu) {
      return res.status(404).json({ error: 'Détail du lieu non trouvé' });
    }

    await detailLieu.update({ noteMoyenne });

    res.status(200).json({
      lieuId: detailLieu.lieuId,
      noteMoyenne: detailLieu.noteMoyenne,
      message: 'Note moyenne mise à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur updateNoteMoyenne:', error);
    res.status(400).json({ error: 'Erreur lors de la mise à jour de la note moyenne' });
  }
};

exports.searchDetailLieux = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        error: 'Le paramètre de recherche q est obligatoire'
      });
    }

    const searchTerm = `%${q.trim()}%`;

    const detailLieux = await DetailLieu.findAll({
      where: {
        [require('sequelize').Op.or]: [
          { description: { [require('sequelize').Op.iLike]: searchTerm } },
          { histoire: { [require('sequelize').Op.iLike]: searchTerm } },
          { referencesHistoriques: { [require('sequelize').Op.iLike]: searchTerm } }
        ]
      },
      include: [
        { 
          model: Lieu,
          attributes: ['id', 'nom', 'typeLieu', 'adresse', 'latitude', 'longitude'],
          where: {
            nom: { [require('sequelize').Op.iLike]: searchTerm }
          },
          required: false
        }
      ]
    });

    res.status(200).json(detailLieux);
  } catch (error) {
    console.error('Erreur searchDetailLieux:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche dans les détails des lieux' });
  }
};