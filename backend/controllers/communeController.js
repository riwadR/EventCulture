const { Commune, Daira, Wilaya } = require('../models');

exports.getAllCommunes = async (req, res) => {
  try {
    const { dairaId, wilayaId } = req.query;
    
    // Construction des filtres
    const where = {};
    if (dairaId) where.dairaId = dairaId;

    // Construction des inclusions
    const includeOptions = [
      { 
        model: Daira,
        attributes: ['id', 'nom', 'wilayaId'],
        include: [
          {
            model: Wilaya,
            attributes: ['id', 'nom']
          }
        ]
      }
    ];

    // Si filtrage par wilaya, ajouter une condition sur la relation
    if (wilayaId && !dairaId) {
      includeOptions[0].where = { wilayaId };
    }

    const communes = await Commune.findAll({
      where,
      include: includeOptions,
      order: [['nom', 'ASC']]
    });
    
    res.status(200).json(communes);
  } catch (error) {
    console.error('Erreur getAllCommunes:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des communes' });
  }
};

exports.getCommuneById = async (req, res) => {
  try {
    const commune = await Commune.findByPk(req.params.id, {
      include: [
        { 
          model: Daira,
          attributes: ['id', 'nom', 'wilayaId'],
          include: [
            {
              model: Wilaya,
              attributes: ['id', 'nom']
            }
          ]
        }
      ]
    });
    
    if (commune) {
      res.status(200).json(commune);
    } else {
      res.status(404).json({ error: 'Commune non trouvée' });
    }
  } catch (error) {
    console.error('Erreur getCommuneById:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la commune' });
  }
};

exports.createCommune = async (req, res) => {
  try {
    const { id, nom, dairaId } = req.body;

    // Validation des champs obligatoires
    if (!id || !nom || !dairaId) {
      return res.status(400).json({
        error: 'Les champs id, nom et dairaId sont obligatoires'
      });
    }

    // Validation du nom (ne doit pas être vide)
    if (nom.trim().length === 0) {
      return res.status(400).json({
        error: 'Le nom ne peut pas être vide'
      });
    }

    // Vérifier si la commune existe déjà
    const existingCommune = await Commune.findByPk(id);
    if (existingCommune) {
      return res.status(409).json({
        error: 'Une commune avec cet ID existe déjà'
      });
    }

    // Vérifier si la daïra existe
    const daira = await Daira.findByPk(dairaId, {
      include: [
        {
          model: Wilaya,
          attributes: ['id', 'nom']
        }
      ]
    });
    if (!daira) {
      return res.status(400).json({
        error: 'La daïra spécifiée n\'existe pas'
      });
    }

    // Vérifier l'unicité du nom dans la même daïra
    const existingCommuneInDaira = await Commune.findOne({
      where: {
        nom: nom.trim(),
        dairaId: dairaId
      }
    });

    if (existingCommuneInDaira) {
      return res.status(409).json({
        error: 'Une commune avec ce nom existe déjà dans cette daïra'
      });
    }

    const newCommune = await Commune.create({
      id,
      nom: nom.trim(),
      dairaId
    });

    // Récupérer la commune créée avec ses relations
    const communeWithRelations = await Commune.findByPk(newCommune.id, {
      include: [
        { 
          model: Daira,
          attributes: ['id', 'nom', 'wilayaId'],
          include: [
            {
              model: Wilaya,
              attributes: ['id', 'nom']
            }
          ]
        }
      ]
    });

    res.status(201).json(communeWithRelations);
  } catch (error) {
    console.error('Erreur createCommune:', error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({
        error: 'Données invalides',
        details: error.errors.map(err => err.message)
      });
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ error: 'Une commune avec cet ID existe déjà' });
    } else if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ error: 'La daïra spécifiée n\'existe pas' });
    } else {
      res.status(400).json({ error: 'Erreur lors de la création de la commune' });
    }
  }
};

exports.updateCommune = async (req, res) => {
  try {
    const { nom, dairaId } = req.body;

    const commune = await Commune.findByPk(req.params.id);
    if (!commune) {
      return res.status(404).json({ error: 'Commune non trouvée' });
    }

    // Validation des données si elles sont fournies
    if (nom !== undefined) {
      if (typeof nom !== 'string' || nom.trim().length === 0) {
        return res.status(400).json({
          error: 'Le nom ne peut pas être vide'
        });
      }
    }

    // Vérifier si la nouvelle daïra existe (si dairaId est fourni)
    let daira = null;
    if (dairaId) {
      daira = await Daira.findByPk(dairaId, {
        include: [
          {
            model: Wilaya,
            attributes: ['id', 'nom']
          }
        ]
      });
      if (!daira) {
        return res.status(400).json({
          error: 'La daïra spécifiée n\'existe pas'
        });
      }
    }

    // Vérifier l'unicité du nom dans la daïra (si nom ou dairaId sont modifiés)
    if (nom || dairaId) {
      const newNom = nom ? nom.trim() : commune.nom;
      const newDairaId = dairaId || commune.dairaId;

      const existingCommuneInDaira = await Commune.findOne({
        where: {
          nom: newNom,
          dairaId: newDairaId,
          id: { [require('sequelize').Op.ne]: commune.id } // Exclure la commune actuelle
        }
      });

      if (existingCommuneInDaira) {
        return res.status(409).json({
          error: 'Une commune avec ce nom existe déjà dans cette daïra'
        });
      }
    }

    // Mise à jour des champs
    const updateData = {};
    if (nom !== undefined) updateData.nom = nom.trim();
    if (dairaId !== undefined) updateData.dairaId = dairaId;

    await commune.update(updateData);

    // Récupérer la commune mise à jour avec ses relations
    const updatedCommune = await Commune.findByPk(commune.id, {
      include: [
        { 
          model: Daira,
          attributes: ['id', 'nom', 'wilayaId'],
          include: [
            {
              model: Wilaya,
              attributes: ['id', 'nom']
            }
          ]
        }
      ]
    });

    res.status(200).json(updatedCommune);
  } catch (error) {
    console.error('Erreur updateCommune:', error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({
        error: 'Données invalides',
        details: error.errors.map(err => err.message)
      });
    } else if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ error: 'La daïra spécifiée n\'existe pas' });
    } else {
      res.status(400).json({ error: 'Erreur lors de la mise à jour de la commune' });
    }
  }
};

exports.deleteCommune = async (req, res) => {
  try {
    const commune = await Commune.findByPk(req.params.id);
    if (commune) {
      await commune.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Commune non trouvée' });
    }
  } catch (error) {
    console.error('Erreur deleteCommune:', error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(409).json({
        error: 'Impossible de supprimer la commune car elle est référencée par d\'autres entités'
      });
    } else {
      res.status(500).json({ error: 'Erreur lors de la suppression de la commune' });
    }
  }
};

// Méthodes utilitaires supplémentaires

exports.getCommunesByDaira = async (req, res) => {
  try {
    const { dairaId } = req.params;

    // Vérifier si la daïra existe
    const daira = await Daira.findByPk(dairaId, {
      include: [
        {
          model: Wilaya,
          attributes: ['id', 'nom']
        }
      ]
    });
    if (!daira) {
      return res.status(404).json({ error: 'Daïra non trouvée' });
    }

    const communes = await Commune.findAll({
      where: { dairaId },
      include: [
        { 
          model: Daira,
          attributes: ['id', 'nom', 'wilayaId'],
          include: [
            {
              model: Wilaya,
              attributes: ['id', 'nom']
            }
          ]
        }
      ],
      order: [['nom', 'ASC']]
    });

    res.status(200).json({
      daira: {
        id: daira.id,
        nom: daira.nom,
        wilaya: daira.Wilaya
      },
      communes: communes,
      total: communes.length
    });
  } catch (error) {
    console.error('Erreur getCommunesByDaira:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des communes par daïra' });
  }
};

exports.getCommunesByWilaya = async (req, res) => {
  try {
    const { wilayaId } = req.params;

    // Vérifier si la wilaya existe
    const wilaya = await Wilaya.findByPk(wilayaId);
    if (!wilaya) {
      return res.status(404).json({ error: 'Wilaya non trouvée' });
    }

    const communes = await Commune.findAll({
      include: [
        { 
          model: Daira,
          attributes: ['id', 'nom', 'wilayaId'],
          where: { wilayaId },
          include: [
            {
              model: Wilaya,
              attributes: ['id', 'nom']
            }
          ]
        }
      ],
      order: [
        [Daira, 'nom', 'ASC'],
        ['nom', 'ASC']
      ]
    });

    // Grouper les communes par daïra
    const communesGroupedByDaira = communes.reduce((acc, commune) => {
      const dairaId = commune.Daira.id;
      if (!acc[dairaId]) {
        acc[dairaId] = {
          daira: {
            id: commune.Daira.id,
            nom: commune.Daira.nom
          },
          communes: []
        };
      }
      acc[dairaId].communes.push({
        id: commune.id,
        nom: commune.nom
      });
      return acc;
    }, {});

    res.status(200).json({
      wilaya: {
        id: wilaya.id,
        nom: wilaya.nom
      },
      dairas: Object.values(communesGroupedByDaira),
      totalCommunes: communes.length
    });
  } catch (error) {
    console.error('Erreur getCommunesByWilaya:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des communes par wilaya' });
  }
};

exports.searchCommunes = async (req, res) => {
  try {
    const { q, dairaId, wilayaId } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        error: 'Le paramètre de recherche q est obligatoire'
      });
    }

    const searchTerm = `%${q.trim()}%`;
    const where = {
      nom: { [require('sequelize').Op.iLike]: searchTerm }
    };

    // Construction des inclusions avec filtres
    const includeOptions = [
      { 
        model: Daira,
        attributes: ['id', 'nom', 'wilayaId'],
        include: [
          {
            model: Wilaya,
            attributes: ['id', 'nom']
          }
        ]
      }
    ];

    // Ajouter le filtre par daïra si spécifié
    if (dairaId) {
      where.dairaId = dairaId;
    }

    // Ajouter le filtre par wilaya si spécifié (et pas de filtre daïra)
    if (wilayaId && !dairaId) {
      includeOptions[0].where = { wilayaId };
    }

    const communes = await Commune.findAll({
      where,
      include: includeOptions,
      order: [['nom', 'ASC']]
    });

    res.status(200).json(communes);
  } catch (error) {
    console.error('Erreur searchCommunes:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche des communes' });
  }
};

exports.getCommuneStats = async (req, res) => {
  try {
    const { dairaId, wilayaId } = req.params;

    let whereClause = {};
    let includeWhere = {};

    if (dairaId) {
      // Vérifier si la daïra existe
      const daira = await Daira.findByPk(dairaId);
      if (!daira) {
        return res.status(404).json({ error: 'Daïra non trouvée' });
      }
      whereClause.dairaId = dairaId;
    } else if (wilayaId) {
      // Vérifier si la wilaya existe
      const wilaya = await Wilaya.findByPk(wilayaId);
      if (!wilaya) {
        return res.status(404).json({ error: 'Wilaya non trouvée' });
      }
      includeWhere.wilayaId = wilayaId;
    }

    // Compter le nombre total de communes
    const totalCommunes = await Commune.count({
      where: whereClause,
      include: Object.keys(includeWhere).length > 0 ? [
        {
          model: Daira,
          where: includeWhere,
          attributes: []
        }
      ] : undefined
    });

    // Statistiques détaillées par daïra
    const communesParDaira = await Commune.findAll({
      where: whereClause,
      include: [
        {
          model: Daira,
          where: includeWhere,
          attributes: ['id', 'nom', 'wilayaId'],
          include: [
            {
              model: Wilaya,
              attributes: ['id', 'nom']
            }
          ]
        }
      ],
      attributes: [
        [require('sequelize').fn('COUNT', require('sequelize').col('Commune.id')), 'count']
      ],
      group: ['Daira.id', 'Daira->Wilaya.id'],
      raw: false
    });

    const stats = {
      totalCommunes,
      communesParDaira: communesParDaira.map(item => ({
        daira: {
          id: item.Daira.id,
          nom: item.Daira.nom,
          wilaya: item.Daira.Wilaya
        },
        count: parseInt(item.dataValues.count)
      }))
    };

    // Ajouter les informations contextuelles
    if (dairaId) {
      stats.daira = await Daira.findByPk(dairaId, {
        include: [{ model: Wilaya, attributes: ['id', 'nom'] }]
      });
    } else if (wilayaId) {
      stats.wilaya = await Wilaya.findByPk(wilayaId, {
        attributes: ['id', 'nom']
      });
    }

    res.status(200).json(stats);
  } catch (error) {
    console.error('Erreur getCommuneStats:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques des communes' });
  }
};