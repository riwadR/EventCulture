const { Daira, Wilaya, Commune } = require('../models');

exports.getAllDairas = async (req, res) => {
  try {
    const { wilayaId } = req.query;
    
    // Construction des filtres
    const where = {};
    if (wilayaId) where.wilayaId = wilayaId;

    const dairas = await Daira.findAll({
      where,
      include: [
        { 
          model: Wilaya,
          attributes: ['id', 'nom']
        },
        { 
          model: Commune, 
          required: false,
          attributes: ['id', 'nom']
        }
      ],
      order: [['nom', 'ASC']]
    });
    
    res.status(200).json(dairas);
  } catch (error) {
    console.error('Erreur getAllDairas:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des daïras' });
  }
};

exports.getDairaById = async (req, res) => {
  try {
    const daira = await Daira.findByPk(req.params.id, {
      include: [
        { 
          model: Wilaya,
          attributes: ['id', 'nom']
        },
        { 
          model: Commune, 
          required: false,
          attributes: ['id', 'nom']
        }
      ]
    });
    
    if (daira) {
      res.status(200).json(daira);
    } else {
      res.status(404).json({ error: 'Daïra non trouvée' });
    }
  } catch (error) {
    console.error('Erreur getDairaById:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la daïra' });
  }
};

exports.createDaira = async (req, res) => {
  try {
    const { id, nom, wilayaId } = req.body;

    // Validation des champs obligatoires
    if (!id || !nom || !wilayaId) {
      return res.status(400).json({
        error: 'Les champs id, nom et wilayaId sont obligatoires'
      });
    }

    // Vérifier si la daïra existe déjà
    const existingDaira = await Daira.findByPk(id);
    if (existingDaira) {
      return res.status(409).json({
        error: 'Une daïra avec cet ID existe déjà'
      });
    }

    // Vérifier si la wilaya existe
    const wilaya = await Wilaya.findByPk(wilayaId);
    if (!wilaya) {
      return res.status(400).json({
        error: 'La wilaya spécifiée n\'existe pas'
      });
    }

    // Vérifier l'unicité du nom dans la même wilaya
    const existingDairaInWilaya = await Daira.findOne({
      where: {
        nom: nom,
        wilayaId: wilayaId
      }
    });

    if (existingDairaInWilaya) {
      return res.status(409).json({
        error: 'Une daïra avec ce nom existe déjà dans cette wilaya'
      });
    }

    const newDaira = await Daira.create({
      id,
      nom,
      wilayaId
    });

    // Récupérer la daïra créée avec ses relations
    const dairaWithRelations = await Daira.findByPk(newDaira.id, {
      include: [
        { 
          model: Wilaya,
          attributes: ['id', 'nom']
        }
      ]
    });

    res.status(201).json(dairaWithRelations);
  } catch (error) {
    console.error('Erreur createDaira:', error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({
        error: 'Données invalides',
        details: error.errors.map(err => err.message)
      });
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ error: 'Une daïra avec cet ID existe déjà' });
    } else if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ error: 'La wilaya spécifiée n\'existe pas' });
    } else {
      res.status(400).json({ error: 'Erreur lors de la création de la daïra' });
    }
  }
};

exports.updateDaira = async (req, res) => {
  try {
    const { nom, wilayaId } = req.body;

    const daira = await Daira.findByPk(req.params.id);
    if (!daira) {
      return res.status(404).json({ error: 'Daïra non trouvée' });
    }

    // Validation des données si elles sont fournies
    if (nom && nom.trim().length === 0) {
      return res.status(400).json({
        error: 'Le nom ne peut pas être vide'
      });
    }

    // Vérifier si la nouvelle wilaya existe (si wilayaId est fourni)
    if (wilayaId) {
      const wilaya = await Wilaya.findByPk(wilayaId);
      if (!wilaya) {
        return res.status(400).json({
          error: 'La wilaya spécifiée n\'existe pas'
        });
      }
    }

    // Vérifier l'unicité du nom dans la wilaya (si nom ou wilayaId sont modifiés)
    if (nom || wilayaId) {
      const newNom = nom || daira.nom;
      const newWilayaId = wilayaId || daira.wilayaId;

      const existingDairaInWilaya = await Daira.findOne({
        where: {
          nom: newNom,
          wilayaId: newWilayaId,
          id: { [require('sequelize').Op.ne]: daira.id } // Exclure la daïra actuelle
        }
      });

      if (existingDairaInWilaya) {
        return res.status(409).json({
          error: 'Une daïra avec ce nom existe déjà dans cette wilaya'
        });
      }
    }

    // Mise à jour des champs
    const updateData = {};
    if (nom !== undefined) updateData.nom = nom;
    if (wilayaId !== undefined) updateData.wilayaId = wilayaId;

    await daira.update(updateData);

    // Récupérer la daïra mise à jour avec ses relations
    const updatedDaira = await Daira.findByPk(daira.id, {
      include: [
        { 
          model: Wilaya,
          attributes: ['id', 'nom']
        },
        { 
          model: Commune, 
          required: false,
          attributes: ['id', 'nom']
        }
      ]
    });

    res.status(200).json(updatedDaira);
  } catch (error) {
    console.error('Erreur updateDaira:', error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({
        error: 'Données invalides',
        details: error.errors.map(err => err.message)
      });
    } else if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ error: 'La wilaya spécifiée n\'existe pas' });
    } else {
      res.status(400).json({ error: 'Erreur lors de la mise à jour de la daïra' });
    }
  }
};

exports.deleteDaira = async (req, res) => {
  try {
    const daira = await Daira.findByPk(req.params.id);
    if (daira) {
      await daira.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Daïra non trouvée' });
    }
  } catch (error) {
    console.error('Erreur deleteDaira:', error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(409).json({
        error: 'Impossible de supprimer la daïra car elle contient des communes ou est référencée par d\'autres entités'
      });
    } else {
      res.status(500).json({ error: 'Erreur lors de la suppression de la daïra' });
    }
  }
};

// Méthodes utilitaires supplémentaires

exports.getDairasByWilaya = async (req, res) => {
  try {
    const { wilayaId } = req.params;

    // Vérifier si la wilaya existe
    const wilaya = await Wilaya.findByPk(wilayaId);
    if (!wilaya) {
      return res.status(404).json({ error: 'Wilaya non trouvée' });
    }

    const dairas = await Daira.findAll({
      where: { wilayaId },
      include: [
        { 
          model: Wilaya,
          attributes: ['id', 'nom']
        },
        { 
          model: Commune, 
          required: false,
          attributes: ['id', 'nom']
        }
      ],
      order: [['nom', 'ASC']]
    });

    res.status(200).json({
      wilaya: {
        id: wilaya.id,
        nom: wilaya.nom
      },
      dairas: dairas,
      total: dairas.length
    });
  } catch (error) {
    console.error('Erreur getDairasByWilaya:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des daïras par wilaya' });
  }
};

exports.searchDairas = async (req, res) => {
  try {
    const { q, wilayaId } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        error: 'Le paramètre de recherche q est obligatoire'
      });
    }

    const searchTerm = `%${q.trim()}%`;
    const where = {
      nom: { [require('sequelize').Op.iLike]: searchTerm }
    };

    // Ajouter le filtre par wilaya si spécifié
    if (wilayaId) {
      where.wilayaId = wilayaId;
    }

    const dairas = await Daira.findAll({
      where,
      include: [
        { 
          model: Wilaya,
          attributes: ['id', 'nom']
        },
        { 
          model: Commune, 
          required: false,
          attributes: ['id', 'nom']
        }
      ],
      order: [['nom', 'ASC']]
    });

    res.status(200).json(dairas);
  } catch (error) {
    console.error('Erreur searchDairas:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche des daïras' });
  }
};

exports.getDairaStats = async (req, res) => {
  try {
    const { wilayaId } = req.params;

    let whereClause = {};
    if (wilayaId) {
      // Vérifier si la wilaya existe
      const wilaya = await Wilaya.findByPk(wilayaId);
      if (!wilaya) {
        return res.status(404).json({ error: 'Wilaya non trouvée' });
      }
      whereClause.wilayaId = wilayaId;
    }

    // Compter le nombre total de daïras
    const totalDairas = await Daira.count({ where: whereClause });

    // Compter le nombre de communes par daïra
    const dairasWithCommuneCount = await Daira.findAll({
      where: whereClause,
      include: [
        { 
          model: Wilaya,
          attributes: ['id', 'nom']
        }
      ],
      attributes: [
        'id',
        'nom',
        'wilayaId',
        [
          require('sequelize').fn('COUNT', require('sequelize').col('Communes.id')),
          'communeCount'
        ]
      ],
      include: [
        {
          model: Commune,
          attributes: [],
          required: false
        },
        { 
          model: Wilaya,
          attributes: ['id', 'nom']
        }
      ],
      group: ['Daira.id', 'Wilaya.id'],
      raw: false
    });

    const stats = {
      totalDairas,
      dairasWithDetails: dairasWithCommuneCount.map(daira => ({
        id: daira.id,
        nom: daira.nom,
        wilaya: daira.Wilaya,
        communeCount: parseInt(daira.dataValues.communeCount) || 0
      }))
    };

    if (wilayaId) {
      stats.wilaya = await Wilaya.findByPk(wilayaId, {
        attributes: ['id', 'nom']
      });
    }

    res.status(200).json(stats);
  } catch (error) {
    console.error('Erreur getDairaStats:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques des daïras' });
  }
};