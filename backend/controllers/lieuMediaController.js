const { LieuMedia, Lieu } = require('../models');

exports.getAllLieuMedias = async (req, res) => {
  try {
    const { lieuId, type } = req.query;
    
    // Construction des filtres
    const where = {};
    if (lieuId) where.lieuId = lieuId;
    if (type) where.type = type;

    const lieuMedias = await LieuMedia.findAll({
      where,
      include: [
        { 
          model: Lieu,
          attributes: ['id', 'nom', 'typeLieu', 'adresse']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json(lieuMedias);
  } catch (error) {
    console.error('Erreur getAllLieuMedias:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des médias des lieux' });
  }
};

exports.getLieuMediaById = async (req, res) => {
  try {
    const lieuMedia = await LieuMedia.findByPk(req.params.id, {
      include: [
        { 
          model: Lieu,
          attributes: ['id', 'nom', 'typeLieu', 'adresse', 'latitude', 'longitude']
        }
      ]
    });

    if (lieuMedia) {
      res.status(200).json(lieuMedia);
    } else {
      res.status(404).json({ error: 'Média du lieu non trouvé' });
    }
  } catch (error) {
    console.error('Erreur getLieuMediaById:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du média du lieu' });
  }
};

exports.createLieuMedia = async (req, res) => {
  try {
    const { lieuId, type, url, description } = req.body;

    // Validation des champs obligatoires
    if (!lieuId || !type || !url) {
      return res.status(400).json({
        error: 'Les champs lieuId, type et url sont obligatoires'
      });
    }

    // Validation du type de média
    const validTypes = ['image', 'video', 'audio', 'document', '360', 'plan'];
    if (!validTypes.includes(type.toLowerCase())) {
      return res.status(400).json({
        error: `Le type doit être l'un des suivants: ${validTypes.join(', ')}`
      });
    }

    // Validation de l'URL
    if (!isValidUrl(url)) {
      return res.status(400).json({
        error: 'L\'URL fournie n\'est pas valide'
      });
    }

    // Vérifier si le lieu existe
    const lieu = await Lieu.findByPk(lieuId);
    if (!lieu) {
      return res.status(400).json({
        error: 'Le lieu spécifié n\'existe pas'
      });
    }

    const newLieuMedia = await LieuMedia.create({
      lieuId,
      type: type.toLowerCase(),
      url,
      description: description || null
    });

    // Récupérer le média créé avec ses relations
    const lieuMediaWithRelations = await LieuMedia.findByPk(newLieuMedia.id, {
      include: [
        { 
          model: Lieu,
          attributes: ['id', 'nom', 'typeLieu', 'adresse']
        }
      ]
    });

    res.status(201).json(lieuMediaWithRelations);
  } catch (error) {
    console.error('Erreur createLieuMedia:', error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({
        error: 'Données invalides',
        details: error.errors.map(err => err.message)
      });
    } else if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ error: 'Le lieu spécifié n\'existe pas' });
    } else {
      res.status(400).json({ error: 'Erreur lors de la création du média du lieu' });
    }
  }
};

exports.updateLieuMedia = async (req, res) => {
  try {
    const { type, url, description } = req.body;

    const lieuMedia = await LieuMedia.findByPk(req.params.id);
    if (!lieuMedia) {
      return res.status(404).json({ error: 'Média du lieu non trouvé' });
    }

    // Validation du type si fourni
    if (type) {
      const validTypes = ['image', 'video', 'audio', 'document', '360', 'plan'];
      if (!validTypes.includes(type.toLowerCase())) {
        return res.status(400).json({
          error: `Le type doit être l'un des suivants: ${validTypes.join(', ')}`
        });
      }
    }

    // Validation de l'URL si fournie
    if (url && !isValidUrl(url)) {
      return res.status(400).json({
        error: 'L\'URL fournie n\'est pas valide'
      });
    }

    // Mise à jour des champs
    const updateData = {};
    if (type !== undefined) updateData.type = type.toLowerCase();
    if (url !== undefined) updateData.url = url;
    if (description !== undefined) updateData.description = description;

    await lieuMedia.update(updateData);

    // Récupérer le média mis à jour avec ses relations
    const updatedLieuMedia = await LieuMedia.findByPk(lieuMedia.id, {
      include: [
        { 
          model: Lieu,
          attributes: ['id', 'nom', 'typeLieu', 'adresse']
        }
      ]
    });

    res.status(200).json(updatedLieuMedia);
  } catch (error) {
    console.error('Erreur updateLieuMedia:', error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({
        error: 'Données invalides',
        details: error.errors.map(err => err.message)
      });
    } else {
      res.status(400).json({ error: 'Erreur lors de la mise à jour du média du lieu' });
    }
  }
};

exports.deleteLieuMedia = async (req, res) => {
  try {
    const lieuMedia = await LieuMedia.findByPk(req.params.id);
    if (lieuMedia) {
      await lieuMedia.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Média du lieu non trouvé' });
    }
  } catch (error) {
    console.error('Erreur deleteLieuMedia:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du média du lieu' });
  }
};

// Méthodes utilitaires supplémentaires

exports.getMediasByLieu = async (req, res) => {
  try {
    const { lieuId } = req.params;
    const { type } = req.query;

    // Vérifier si le lieu existe
    const lieu = await Lieu.findByPk(lieuId);
    if (!lieu) {
      return res.status(404).json({ error: 'Lieu non trouvé' });
    }

    // Construction des filtres
    const where = { lieuId };
    if (type) {
      const validTypes = ['image', 'video', 'audio', 'document', '360', 'plan'];
      if (!validTypes.includes(type.toLowerCase())) {
        return res.status(400).json({
          error: `Le type doit être l'un des suivants: ${validTypes.join(', ')}`
        });
      }
      where.type = type.toLowerCase();
    }

    const medias = await LieuMedia.findAll({
      where,
      include: [
        { 
          model: Lieu,
          attributes: ['id', 'nom', 'typeLieu', 'adresse']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Grouper par type de média
    const mediasByType = medias.reduce((acc, media) => {
      if (!acc[media.type]) {
        acc[media.type] = [];
      }
      acc[media.type].push(media);
      return acc;
    }, {});

    res.status(200).json({
      lieu: {
        id: lieu.id,
        nom: lieu.nom,
        typeLieu: lieu.typeLieu,
        adresse: lieu.adresse
      },
      medias: medias,
      mediasByType: mediasByType,
      total: medias.length
    });
  } catch (error) {
    console.error('Erreur getMediasByLieu:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des médias par lieu' });
  }
};

exports.getMediasByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { lieuId } = req.query;

    // Validation du type
    const validTypes = ['image', 'video', 'audio', 'document', '360', 'plan'];
    if (!validTypes.includes(type.toLowerCase())) {
      return res.status(400).json({
        error: `Le type doit être l'un des suivants: ${validTypes.join(', ')}`
      });
    }

    // Construction des filtres
    const where = { type: type.toLowerCase() };
    if (lieuId) where.lieuId = lieuId;

    const medias = await LieuMedia.findAll({
      where,
      include: [
        { 
          model: Lieu,
          attributes: ['id', 'nom', 'typeLieu', 'adresse']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      type: type.toLowerCase(),
      medias: medias,
      total: medias.length
    });
  } catch (error) {
    console.error('Erreur getMediasByType:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des médias par type' });
  }
};

exports.bulkCreateLieuMedias = async (req, res) => {
  try {
    const { lieuId, medias } = req.body;

    // Validation des données
    if (!lieuId || !Array.isArray(medias) || medias.length === 0) {
      return res.status(400).json({
        error: 'Les champs lieuId et medias (tableau non vide) sont obligatoires'
      });
    }

    // Vérifier si le lieu existe
    const lieu = await Lieu.findByPk(lieuId);
    if (!lieu) {
      return res.status(400).json({
        error: 'Le lieu spécifié n\'existe pas'
      });
    }

    // Validation de chaque média
    const validTypes = ['image', 'video', 'audio', 'document', '360', 'plan'];
    const validatedMedias = [];

    for (let i = 0; i < medias.length; i++) {
      const media = medias[i];
      
      if (!media.type || !media.url) {
        return res.status(400).json({
          error: `Média ${i + 1}: les champs type et url sont obligatoires`
        });
      }

      if (!validTypes.includes(media.type.toLowerCase())) {
        return res.status(400).json({
          error: `Média ${i + 1}: le type doit être l'un des suivants: ${validTypes.join(', ')}`
        });
      }

      if (!isValidUrl(media.url)) {
        return res.status(400).json({
          error: `Média ${i + 1}: l'URL fournie n'est pas valide`
        });
      }

      validatedMedias.push({
        lieuId,
        type: media.type.toLowerCase(),
        url: media.url,
        description: media.description || null
      });
    }

    // Création en lot
    const createdMedias = await LieuMedia.bulkCreate(validatedMedias, {
      returning: true
    });

    // Récupérer les médias créés avec leurs relations
    const mediasWithRelations = await LieuMedia.findAll({
      where: {
        id: createdMedias.map(media => media.id)
      },
      include: [
        { 
          model: Lieu,
          attributes: ['id', 'nom', 'typeLieu', 'adresse']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(201).json({
      message: `${createdMedias.length} médias créés avec succès`,
      medias: mediasWithRelations
    });
  } catch (error) {
    console.error('Erreur bulkCreateLieuMedias:', error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({
        error: 'Données invalides',
        details: error.errors.map(err => err.message)
      });
    } else {
      res.status(400).json({ error: 'Erreur lors de la création en lot des médias' });
    }
  }
};

exports.getMediaStats = async (req, res) => {
  try {
    const { lieuId } = req.query;

    let whereClause = {};
    if (lieuId) whereClause.lieuId = lieuId;

    // Statistiques par type
    const statsByType = await LieuMedia.findAll({
      where: whereClause,
      attributes: [
        'type',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['type'],
      raw: true
    });

    // Total des médias
    const totalMedias = await LieuMedia.count({ where: whereClause });

    // Statistiques par lieu si pas de filtre lieuId
    let statsByLieu = null;
    if (!lieuId) {
      statsByLieu = await LieuMedia.findAll({
        attributes: [
          [require('sequelize').fn('COUNT', require('sequelize').col('LieuMedia.id')), 'count']
        ],
        include: [
          {
            model: Lieu,
            attributes: ['id', 'nom', 'typeLieu']
          }
        ],
        group: ['Lieu.id'],
        raw: false
      });
    }

    const stats = {
      totalMedias,
      statsByType: statsByType.map(stat => ({
        type: stat.type,
        count: parseInt(stat.count)
      })),
      ...(statsByLieu && {
        statsByLieu: statsByLieu.map(stat => ({
          lieu: stat.Lieu,
          count: parseInt(stat.dataValues.count)
        }))
      })
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Erreur getMediaStats:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques des médias' });
  }
};

// Fonction utilitaire pour valider les URLs
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}