const { Lieu, Wilaya, Daira, Commune, DetailLieu, LieuMedia, Service } = require('../models');

exports.getAllLieux = async (req, res) => {
  try {
    const { typeLieu, wilayaId, dairaId, communeId } = req.query;
    
    // Construction des filtres
    const where = {};
    if (typeLieu) where.typeLieu = typeLieu;
    if (wilayaId) where.wilayaId = wilayaId;
    if (dairaId) where.dairaId = dairaId;
    if (communeId) where.communeId = communeId;

    const lieux = await Lieu.findAll({
      where,
      include: [
        { 
          model: Wilaya, 
          required: false,
          attributes: ['id', 'nom']
        },
        { 
          model: Daira, 
          required: false,
          attributes: ['id', 'nom']
        },
        { 
          model: Commune, 
          required: false,
          attributes: ['id', 'nom']
        },
        { 
          model: DetailLieu, 
          required: false 
        },
        { 
          model: LieuMedia, 
          required: false 
        },
        { 
          model: Service, 
          required: false 
        }
      ]
    });
    
    res.status(200).json(lieux);
  } catch (error) {
    console.error('Erreur getAllLieux:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des lieux' });
  }
};

exports.getLieuById = async (req, res) => {
  try {
    const lieu = await Lieu.findByPk(req.params.id, {
      include: [
        { 
          model: Wilaya, 
          required: false,
          attributes: ['id', 'nom']
        },
        { 
          model: Daira, 
          required: false,
          attributes: ['id', 'nom']
        },
        { 
          model: Commune, 
          required: false,
          attributes: ['id', 'nom']
        },
        { 
          model: DetailLieu, 
          required: false 
        },
        { 
          model: LieuMedia, 
          required: false 
        },
        { 
          model: Service, 
          required: false 
        }
      ]
    });
    
    if (lieu) {
      res.status(200).json(lieu);
    } else {
      res.status(404).json({ error: 'Lieu non trouvé' });
    }
  } catch (error) {
    console.error('Erreur getLieuById:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du lieu' });
  }
};

exports.createLieu = async (req, res) => {
  try {
    const {
      id,
      typeLieu,
      wilayaId,
      dairaId,
      communeId,
      nom,
      adresse,
      latitude,
      longitude
    } = req.body;

    // Validation des champs obligatoires
    if (!id || !typeLieu || !nom || !adresse || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        error: 'Les champs id, typeLieu, nom, adresse, latitude et longitude sont obligatoires'
      });
    }

    // Validation du typeLieu
    if (!['Wilaya', 'Daira', 'Commune'].includes(typeLieu)) {
      return res.status(400).json({
        error: 'typeLieu doit être "Wilaya", "Daira" ou "Commune"'
      });
    }

    // Validation des coordonnées
    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({
        error: 'La latitude doit être comprise entre -90 et 90'
      });
    }
    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({
        error: 'La longitude doit être comprise entre -180 et 180'
      });
    }

    // Vérifier si le lieu existe déjà
    const existingLieu = await Lieu.findByPk(id);
    if (existingLieu) {
      return res.status(409).json({
        error: 'Un lieu avec cet ID existe déjà'
      });
    }

    // Validation de la cohérence typeLieu/locationId
    const locations = [wilayaId, dairaId, communeId].filter(id => id !== null && id !== undefined);
    if (locations.length !== 1) {
      return res.status(400).json({
        error: 'Exactement un seul des champs wilayaId, dairaId ou communeId doit être défini'
      });
    }

    if (typeLieu === 'Wilaya' && !wilayaId) {
      return res.status(400).json({
        error: 'wilayaId est obligatoire pour typeLieu "Wilaya"'
      });
    }
    if (typeLieu === 'Daira' && !dairaId) {
      return res.status(400).json({
        error: 'dairaId est obligatoire pour typeLieu "Daira"'
      });
    }
    if (typeLieu === 'Commune' && !communeId) {
      return res.status(400).json({
        error: 'communeId est obligatoire pour typeLieu "Commune"'
      });
    }

    // Vérifier l'existence de la relation
    if (wilayaId) {
      const wilaya = await Wilaya.findByPk(wilayaId);
      if (!wilaya) {
        return res.status(400).json({ error: 'Wilaya non trouvée' });
      }
    }
    if (dairaId) {
      const daira = await Daira.findByPk(dairaId);
      if (!daira) {
        return res.status(400).json({ error: 'Daira non trouvée' });
      }
    }
    if (communeId) {
      const commune = await Commune.findByPk(communeId);
      if (!commune) {
        return res.status(400).json({ error: 'Commune non trouvée' });
      }
    }

    const newLieu = await Lieu.create({
      id,
      typeLieu,
      wilayaId,
      dairaId,
      communeId,
      nom,
      adresse,
      latitude,
      longitude
    });

    res.status(201).json(newLieu);
  } catch (error) {
    console.error('Erreur createLieu:', error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({
        error: 'Données invalides',
        details: error.errors.map(err => err.message)
      });
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ error: 'Un lieu avec cet ID existe déjà' });
    } else {
      res.status(400).json({ error: 'Erreur lors de la création du lieu' });
    }
  }
};

exports.updateLieu = async (req, res) => {
  try {
    const {
      typeLieu,
      wilayaId,
      dairaId,
      communeId,
      nom,
      adresse,
      latitude,
      longitude
    } = req.body;

    const lieu = await Lieu.findByPk(req.params.id);
    if (!lieu) {
      return res.status(404).json({ error: 'Lieu non trouvé' });
    }

    // Validation du typeLieu si fourni
    if (typeLieu && !['Wilaya', 'Daira', 'Commune'].includes(typeLieu)) {
      return res.status(400).json({
        error: 'typeLieu doit être "Wilaya", "Daira" ou "Commune"'
      });
    }

    // Validation des coordonnées si fournies
    if (latitude !== undefined && (latitude < -90 || latitude > 90)) {
      return res.status(400).json({
        error: 'La latitude doit être comprise entre -90 et 90'
      });
    }
    if (longitude !== undefined && (longitude < -180 || longitude > 180)) {
      return res.status(400).json({
        error: 'La longitude doit être comprise entre -180 et 180'
      });
    }

    // Si typeLieu ou les IDs de location sont modifiés, valider la cohérence
    const newTypeLieu = typeLieu || lieu.typeLieu;
    const newWilayaId = wilayaId !== undefined ? wilayaId : lieu.wilayaId;
    const newDairaId = dairaId !== undefined ? dairaId : lieu.dairaId;
    const newCommuneId = communeId !== undefined ? communeId : lieu.communeId;

    const locations = [newWilayaId, newDairaId, newCommuneId].filter(id => id !== null && id !== undefined);
    if (locations.length !== 1) {
      return res.status(400).json({
        error: 'Exactement un seul des champs wilayaId, dairaId ou communeId doit être défini'
      });
    }

    if (newTypeLieu === 'Wilaya' && !newWilayaId) {
      return res.status(400).json({
        error: 'wilayaId est obligatoire pour typeLieu "Wilaya"'
      });
    }
    if (newTypeLieu === 'Daira' && !newDairaId) {
      return res.status(400).json({
        error: 'dairaId est obligatoire pour typeLieu "Daira"'
      });
    }
    if (newTypeLieu === 'Commune' && !newCommuneId) {
      return res.status(400).json({
        error: 'communeId est obligatoire pour typeLieu "Commune"'
      });
    }

    // Vérifier l'existence des relations si elles sont modifiées
    if (wilayaId !== undefined && wilayaId) {
      const wilaya = await Wilaya.findByPk(wilayaId);
      if (!wilaya) {
        return res.status(400).json({ error: 'Wilaya non trouvée' });
      }
    }
    if (dairaId !== undefined && dairaId) {
      const daira = await Daira.findByPk(dairaId);
      if (!daira) {
        return res.status(400).json({ error: 'Daira non trouvée' });
      }
    }
    if (communeId !== undefined && communeId) {
      const commune = await Commune.findByPk(communeId);
      if (!commune) {
        return res.status(400).json({ error: 'Commune non trouvée' });
      }
    }

    // Mise à jour des champs
    const updateData = {};
    if (typeLieu !== undefined) updateData.typeLieu = typeLieu;
    if (wilayaId !== undefined) updateData.wilayaId = wilayaId;
    if (dairaId !== undefined) updateData.dairaId = dairaId;
    if (communeId !== undefined) updateData.communeId = communeId;
    if (nom !== undefined) updateData.nom = nom;
    if (adresse !== undefined) updateData.adresse = adresse;
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;

    await lieu.update(updateData);
    res.status(200).json(lieu);
  } catch (error) {
    console.error('Erreur updateLieu:', error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({
        error: 'Données invalides',
        details: error.errors.map(err => err.message)
      });
    } else {
      res.status(400).json({ error: 'Erreur lors de la mise à jour du lieu' });
    }
  }
};

exports.deleteLieu = async (req, res) => {
  try {
    const lieu = await Lieu.findByPk(req.params.id);
    if (lieu) {
      await lieu.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Lieu non trouvé' });
    }
  } catch (error) {
    console.error('Erreur deleteLieu:', error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(409).json({
        error: 'Impossible de supprimer le lieu car il est référencé par d\'autres entités'
      });
    } else {
      res.status(500).json({ error: 'Erreur lors de la suppression du lieu' });
    }
  }
};

// Méthodes utilitaires supplémentaires

exports.getLieuxByType = async (req, res) => {
  try {
    const { typeLieu } = req.params;
    
    if (!['Wilaya', 'Daira', 'Commune'].includes(typeLieu)) {
      return res.status(400).json({
        error: 'typeLieu doit être "Wilaya", "Daira" ou "Commune"'
      });
    }

    const lieux = await Lieu.findAll({
      where: { typeLieu },
      include: [
        { 
          model: Wilaya, 
          required: false,
          attributes: ['id', 'nom']
        },
        { 
          model: Daira, 
          required: false,
          attributes: ['id', 'nom']
        },
        { 
          model: Commune, 
          required: false,
          attributes: ['id', 'nom']
        }
      ]
    });
    
    res.status(200).json(lieux);
  } catch (error) {
    console.error('Erreur getLieuxByType:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des lieux par type' });
  }
};

exports.getLieuxNearby = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        error: 'Les paramètres latitude et longitude sont obligatoires'
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const radiusKm = parseFloat(radius);

    if (isNaN(lat) || isNaN(lng) || isNaN(radiusKm)) {
      return res.status(400).json({
        error: 'Les coordonnées et le rayon doivent être des nombres valides'
      });
    }

    // Utilisation de la formule de Haversine pour calculer la distance
    const lieux = await Lieu.findAll({
      include: [
        { 
          model: Wilaya, 
          required: false,
          attributes: ['id', 'nom']
        },
        { 
          model: Daira, 
          required: false,
          attributes: ['id', 'nom']
        },
        { 
          model: Commune, 
          required: false,
          attributes: ['id', 'nom']
        }
      ]
    });

    // Filtrer par distance côté application (pour une solution plus performante, 
    // utilisez une extension PostGIS si vous utilisez PostgreSQL)
    const lieuxNearby = lieux.filter(lieu => {
      const distance = calculateDistance(lat, lng, lieu.latitude, lieu.longitude);
      return distance <= radiusKm;
    }).map(lieu => {
      const distance = calculateDistance(lat, lng, lieu.latitude, lieu.longitude);
      return {
        ...lieu.toJSON(),
        distance: Math.round(distance * 100) / 100 // Arrondir à 2 décimales
      };
    }).sort((a, b) => a.distance - b.distance);

    res.status(200).json(lieuxNearby);
  } catch (error) {
    console.error('Erreur getLieuxNearby:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche des lieux à proximité' });
  }
};

// Fonction utilitaire pour calculer la distance entre deux points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Rayon de la Terre en kilomètres
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}