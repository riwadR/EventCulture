const express = require('express');
const router = express.Router();

const initMetadataRoutes = (models) => {
  // Route pour récupérer toutes les métadonnées
  router.get('/', async (req, res) => {
    try {
      const metadata = {
        langues: await models.Langue.findAll({ order: [['nom', 'ASC']] }),
        categories: await models.Categorie.findAll({ order: [['nom', 'ASC']] }),
        genres: await models.Genre.findAll({ order: [['nom', 'ASC']] }),
        types_oeuvres: await models.TypeOeuvre.findAll({ order: [['nom_type', 'ASC']] }),
        types_evenements: await models.TypeEvenement.findAll({ order: [['nom_type', 'ASC']] }),
        types_organisations: await models.TypeOrganisation.findAll({ order: [['nom', 'ASC']] }),
        materiaux: await models.Materiau.findAll({ order: [['nom', 'ASC']] }),
        techniques: await models.Technique.findAll({ order: [['nom', 'ASC']] }),
        roles: await models.Role.findAll({ order: [['nom_role', 'ASC']] }),
        wilayas: await models.Wilaya.findAll({ 
          order: [['nom', 'ASC']],
          include: [
            { 
              model: models.Daira,
              include: [{ model: models.Commune }]
            }
          ]
        })
      };
      
      res.json({
        success: true,
        data: metadata
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des métadonnées:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la récupération des métadonnées' 
      });
    }
  });

  // Routes spécifiques pour chaque type de métadonnée
  router.get('/langues', async (req, res) => {
    try {
      const langues = await models.Langue.findAll({ order: [['nom', 'ASC']] });
      res.json({ success: true, data: langues });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erreur serveur' });
    }
  });

  router.get('/categories', async (req, res) => {
    try {
      const categories = await models.Categorie.findAll({ order: [['nom', 'ASC']] });
      res.json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erreur serveur' });
    }
  });

  router.get('/types-oeuvres', async (req, res) => {
    try {
      const types = await models.TypeOeuvre.findAll({ order: [['nom_type', 'ASC']] });
      res.json({ success: true, data: types });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erreur serveur' });
    }
  });

  router.get('/wilayas', async (req, res) => {
    try {
      const { with_hierarchy = false } = req.query;
      
      const include = with_hierarchy === 'true' ? [
        { 
          model: models.Daira,
          include: [{ model: models.Commune }]
        }
      ] : [];

      const wilayas = await models.Wilaya.findAll({ 
        order: [['nom', 'ASC']],
        include
      });
      
      res.json({ success: true, data: wilayas });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erreur serveur' });
    }
  });

  return router;
};

module.exports = initMetadataRoutes;