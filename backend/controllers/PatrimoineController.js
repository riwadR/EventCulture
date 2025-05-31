const { Op } = require('sequelize');

class PatrimoineController {
  constructor(models) {
    this.models = models;
  }

  // Récupérer tous les sites patrimoniaux
  async getAllSitesPatrimoniaux(req, res) {
    try {
      const { 
        page = 1, 
        limit = 12, 
        wilaya,
        type_patrimoine, // monument, vestige, site_culturel
        search,
        sort = 'nom'
      } = req.query;

      const offset = (page - 1) * limit;
      const where = {};
      const include = [
        { 
          model: this.models.Wilaya,
          attributes: ['nom', 'codeW']
        },
        { 
          model: this.models.Daira,
          attributes: ['nom']
        },
        { 
          model: this.models.Commune,
          attributes: ['nom']
        },
        { 
          model: this.models.DetailLieu,
          include: [
            { 
              model: this.models.Monument,
              required: false
            },
            { 
              model: this.models.Vestige,
              required: false
            }
          ]
        },
        { 
          model: this.models.LieuMedia,
          where: { type: 'image' },
          required: false,
          limit: 3, // Premières images pour l'aperçu
          order: [['createdAt', 'ASC']]
        }
      ];

      // Filtres géographiques
      if (wilaya) {
        where.wilayaId = wilaya;
      }

      // Recherche textuelle
      if (search) {
        where[Op.or] = [
          { nom: { [Op.like]: `%${search}%` } },
          { adresse: { [Op.like]: `%${search}%` } },
          { '$DetailLieu.description$': { [Op.like]: `%${search}%` } },
          { '$DetailLieu.histoire$': { [Op.like]: `%${search}%` } }
        ];
      }

      // Filtrage par type de patrimoine
      if (type_patrimoine) {
        if (type_patrimoine === 'monument') {
          include[3].include[0].required = true;
        } else if (type_patrimoine === 'vestige') {
          include[3].include[1].required = true;
        }
      }

      // Seulement les lieux qui ont des détails patrimoniaux
      include[3].required = true;

      // Tri
      let order;
      switch (sort) {
        case 'nom':
          order = [['nom', 'ASC']];
          break;
        case 'note':
          order = [[this.models.DetailLieu, 'noteMoyenne', 'DESC']];
          break;
        case 'recent':
          order = [['createdAt', 'DESC']];
          break;
        default:
          order = [['nom', 'ASC']];
      }

      const sites = await this.models.Lieu.findAndCountAll({
        where,
        include,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order,
        distinct: true
      });

      // Enrichir les données avec des informations de patrimoine
      const sitesEnriches = sites.rows.map(site => {
        const siteData = site.toJSON();
        
        // Déterminer le type de patrimoine
        let typePatrimoine = 'site_culturel';
        if (siteData.DetailLieu?.Monuments?.length > 0) {
          typePatrimoine = 'monument';
        } else if (siteData.DetailLieu?.Vestiges?.length > 0) {
          typePatrimoine = 'vestige';
        }

        // Image principale (première image disponible)
        const imagePrincipale = siteData.LieuMedias?.find(media => media.type === 'image')?.url || null;

        return {
          ...siteData,
          typePatrimoine,
          imagePrincipale,
          nombreImages: siteData.LieuMedias?.length || 0,
          notesMoyenne: siteData.DetailLieu?.noteMoyenne || 0
        };
      });

      res.json({
        success: true,
        data: {
          sites: sitesEnriches,
          pagination: {
            total: sites.count,
            page: parseInt(page),
            pages: Math.ceil(sites.count / limit),
            limit: parseInt(limit)
          },
          filters: {
            wilaya,
            type_patrimoine,
            search,
            sort
          }
        }
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des sites patrimoniaux:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la récupération des sites patrimoniaux' 
      });
    }
  }

  // Récupérer les détails complets d'un site patrimonial
  async getSitePatrimonialById(req, res) {
    try {
      const { id } = req.params;

      const site = await this.models.Lieu.findByPk(id, {
        include: [
          { 
            model: this.models.Wilaya,
            attributes: ['nom', 'codeW', 'wilaya_name_ascii']
          },
          { 
            model: this.models.Daira,
            attributes: ['nom', 'daira_name_ascii']
          },
          { 
            model: this.models.Commune,
            attributes: ['nom', 'commune_name_ascii']
          },
          { 
            model: this.models.Localite,
            attributes: ['nom'],
            required: false
          },
          { 
            model: this.models.DetailLieu,
            include: [
              { 
                model: this.models.Monument,
                attributes: ['nom', 'description', 'type']
              },
              { 
                model: this.models.Vestige,
                attributes: ['nom', 'description', 'type']
              }
            ]
          },
          { 
            model: this.models.LieuMedia,
            order: [['createdAt', 'ASC']]
          },
          { 
            model: this.models.Service,
            attributes: ['nom']
          },
          {
            model: this.models.Evenement,
            where: { 
              date_fin: { [Op.gte]: new Date() }
            },
            required: false,
            attributes: ['id_evenement', 'nom_evenement', 'date_debut', 'date_fin', 'description'],
            include: [
              { 
                model: this.models.TypeEvenement, 
                attributes: ['nom_type'] 
              }
            ]
          }
        ]
      });

      if (!site) {
        return res.status(404).json({ 
          success: false, 
          error: 'Site patrimonial non trouvé' 
        });
      }

      // Organiser les médias par type
      const siteData = site.toJSON();
      const medias = {
        images: siteData.LieuMedias?.filter(media => media.type === 'image') || [],
        videos: siteData.LieuMedias?.filter(media => media.type === 'video') || [],
        documents: siteData.LieuMedias?.filter(media => media.type === 'document') || []
      };

      // Déterminer le type de patrimoine et ses spécificités
      let typePatrimoine = 'site_culturel';
      let elements = [];

      if (siteData.DetailLieu?.Monuments?.length > 0) {
        typePatrimoine = 'monument';
        elements = siteData.DetailLieu.Monuments;
      } else if (siteData.DetailLieu?.Vestiges?.length > 0) {
        typePatrimoine = 'vestige';
        elements = siteData.DetailLieu.Vestiges;
      }

      // Adresse complète formatée
      const adresseComplete = [
        siteData.adresse,
        siteData.Commune?.nom,
        siteData.Daira?.nom,
        siteData.Wilaya?.nom
      ].filter(Boolean).join(', ');

      const response = {
        ...siteData,
        typePatrimoine,
        elements,
        medias,
        adresseComplete,
        coordonnees: {
          latitude: siteData.latitude,
          longitude: siteData.longitude
        },
        evenementsAvenir: siteData.Evenements || []
      };

      res.json({
        success: true,
        data: response
      });

    } catch (error) {
      console.error('Erreur lors de la récupération du site patrimonial:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la récupération du site patrimonial' 
      });
    }
  }

  // Récupérer la galerie de médias d'un site
  async getGalerieSite(req, res) {
    try {
      const { id } = req.params;
      const { type = 'all', page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      const where = { id_lieu: id };
      if (type !== 'all') {
        where.type = type;
      }

      const medias = await this.models.LieuMedia.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: this.models.Lieu,
            attributes: ['nom']
          }
        ]
      });

      res.json({
        success: true,
        data: {
          medias: medias.rows,
          pagination: {
            total: medias.count,
            page: parseInt(page),
            pages: Math.ceil(medias.count / limit),
            limit: parseInt(limit)
          }
        }
      });

    } catch (error) {
      console.error('Erreur lors de la récupération de la galerie:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la récupération de la galerie' 
      });
    }
  }

  // Récupérer les monuments par type
  async getMonumentsByType(req, res) {
    try {
      const { type } = req.params; // Mosquée, Palais, Statue, Tour, Musée
      const { page = 1, limit = 12, wilaya } = req.query;
      const offset = (page - 1) * limit;

      const where = { type };
      const include = [
        {
          model: this.models.DetailLieu,
          include: [
            {
              model: this.models.Lieu,
              include: [
                { model: this.models.Wilaya, attributes: ['nom'] },
                { model: this.models.LieuMedia, where: { type: 'image' }, required: false, limit: 1 }
              ]
            }
          ]
        }
      ];

      // Filtre par wilaya si spécifié
      if (wilaya) {
        include[0].include[0].where = { wilayaId: wilaya };
      }

      const monuments = await this.models.Monument.findAndCountAll({
        where,
        include,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['nom', 'ASC']]
      });

      res.json({
        success: true,
        data: {
          monuments: monuments.rows,
          type,
          pagination: {
            total: monuments.count,
            page: parseInt(page),
            pages: Math.ceil(monuments.count / limit),
            limit: parseInt(limit)
          }
        }
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des monuments:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la récupération des monuments' 
      });
    }
  }

  // Récupérer les vestiges par type
  async getVestigesByType(req, res) {
    try {
      const { type } = req.params; // Ruines, Murailles, Site archéologique
      const { page = 1, limit = 12, wilaya } = req.query;
      const offset = (page - 1) * limit;

      const where = { type };
      const include = [
        {
          model: this.models.DetailLieu,
          include: [
            {
              model: this.models.Lieu,
              include: [
                { model: this.models.Wilaya, attributes: ['nom'] },
                { model: this.models.LieuMedia, where: { type: 'image' }, required: false, limit: 1 }
              ]
            }
          ]
        }
      ];

      if (wilaya) {
        include[0].include[0].where = { wilayaId: wilaya };
      }

      const vestiges = await this.models.Vestige.findAndCountAll({
        where,
        include,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['nom', 'ASC']]
      });

      res.json({
        success: true,
        data: {
          vestiges: vestiges.rows,
          type,
          pagination: {
            total: vestiges.count,
            page: parseInt(page),
            pages: Math.ceil(vestiges.count / limit),
            limit: parseInt(limit)
          }
        }
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des vestiges:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la récupération des vestiges' 
      });
    }
  }

  // Recherche patrimoine avancée
  async recherchePatrimoine(req, res) {
    try {
      const { 
        q, 
        wilaya, 
        type_patrimoine,
        type_monument,
        type_vestige,
        periode,
        services,
        limit = 20 
      } = req.query;

      const where = {};
      const include = [
        { model: this.models.Wilaya, attributes: ['nom'] },
        { 
          model: this.models.DetailLieu,
          include: [
            { 
              model: this.models.Monument,
              required: false
            },
            { 
              model: this.models.Vestige,
              required: false
            }
          ]
        },
        { 
          model: this.models.LieuMedia,
          where: { type: 'image' },
          required: false,
          limit: 1
        }
      ];

      // Recherche textuelle
      if (q) {
        where[Op.or] = [
          { nom: { [Op.like]: `%${q}%` } },
          { adresse: { [Op.like]: `%${q}%` } },
          { '$DetailLieu.description$': { [Op.like]: `%${q}%` } },
          { '$DetailLieu.histoire$': { [Op.like]: `%${q}%` } },
          { '$DetailLieu.Monuments.nom$': { [Op.like]: `%${q}%` } },
          { '$DetailLieu.Vestiges.nom$': { [Op.like]: `%${q}%` } }
        ];
      }

      // Filtres spécifiques
      if (wilaya) where.wilayaId = wilaya;
      
      if (type_monument) {
        include[1].include[0].where = { type: type_monument };
        include[1].include[0].required = true;
      }
      
      if (type_vestige) {
        include[1].include[1].where = { type: type_vestige };
        include[1].include[1].required = true;
      }

      // Services disponibles
      if (services) {
        include.push({
          model: this.models.Service,
          where: { nom: { [Op.in]: services.split(',') } },
          required: true
        });
      }

      const resultats = await this.models.Lieu.findAll({
        where,
        include,
        limit: parseInt(limit),
        order: [
          // Pertinence : sites avec nom correspondant en premier
          q ? [this.models.sequelize.literal(`CASE WHEN nom LIKE '%${q}%' THEN 0 ELSE 1 END`)] : ['nom', 'ASC']
        ]
      });

      res.json({
        success: true,
        data: {
          resultats,
          count: resultats.length,
          query: {
            q, wilaya, type_patrimoine, type_monument, type_vestige, services
          }
        }
      });

    } catch (error) {
      console.error('Erreur lors de la recherche patrimoine:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la recherche' 
      });
    }
  }

  // Statistiques du patrimoine
  async getStatistiquesPatrimoine(req, res) {
    try {
      // Nombre total de sites par type
      const sitesParType = await this.models.Lieu.findAll({
        attributes: [
          [this.models.sequelize.fn('COUNT', this.models.sequelize.col('Lieu.id_lieu')), 'total'],
          [this.models.sequelize.col('Wilaya.nom'), 'wilaya']
        ],
        include: [
          {
            model: this.models.Wilaya,
            attributes: []
          },
          {
            model: this.models.DetailLieu,
            required: true
          }
        ],
        group: ['Wilaya.id_wilaya', 'Wilaya.nom'],
        order: [[this.models.sequelize.literal('total'), 'DESC']]
      });

      // Monuments par type
      const monumentsParType = await this.models.Monument.findAll({
        attributes: [
          'type',
          [this.models.sequelize.fn('COUNT', this.models.sequelize.col('Monument.id')), 'total']
        ],
        group: ['type'],
        order: [[this.models.sequelize.literal('total'), 'DESC']]
      });

      // Vestiges par type
      const vestigesParType = await this.models.Vestige.findAll({
        attributes: [
          'type',
          [this.models.sequelize.fn('COUNT', this.models.sequelize.col('Vestige.id')), 'total']
        ],
        group: ['type'],
        order: [[this.models.sequelize.literal('total'), 'DESC']]
      });

      // Sites les mieux notés
      const sitesMieuxNotes = await this.models.Lieu.findAll({
        include: [
          {
            model: this.models.DetailLieu,
            where: { noteMoyenne: { [Op.gt]: 0 } },
            required: true
          },
          {
            model: this.models.Wilaya,
            attributes: ['nom']
          },
          {
            model: this.models.LieuMedia,
            where: { type: 'image' },
            required: false,
            limit: 1
          }
        ],
        order: [[this.models.DetailLieu, 'noteMoyenne', 'DESC']],
        limit: 10
      });

      res.json({
        success: true,
        data: {
          sitesParWilaya: sitesParType,
          monumentsParType,
          vestigesParType,
          sitesMieuxNotes,
          totaux: {
            sites: sitesParType.reduce((sum, item) => sum + parseInt(item.dataValues.total), 0),
            monuments: monumentsParType.reduce((sum, item) => sum + parseInt(item.dataValues.total), 0),
            vestiges: vestigesParType.reduce((sum, item) => sum + parseInt(item.dataValues.total), 0)
          }
        }
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la récupération des statistiques' 
      });
    }
  }

  // Sites patrimoniaux populaires (les plus consultés)
  async getSitesPopulaires(req, res) {
    try {
      const { limit = 6 } = req.query;

      const sites = await this.models.Lieu.findAll({
        include: [
          {
            model: this.models.DetailLieu,
            where: { noteMoyenne: { [Op.gt]: 4 } },
            required: true
          },
          {
            model: this.models.Wilaya,
            attributes: ['nom']
          },
          {
            model: this.models.LieuMedia,
            where: { type: 'image' },
            required: false,
            limit: 1,
            order: [['createdAt', 'ASC']]
          },
          {
            model: this.models.Monument,
            through: { model: this.models.DetailLieu },
            required: false
          },
          {
            model: this.models.Vestige,
            through: { model: this.models.DetailLieu },
            required: false
          }
        ],
        order: [
          [this.models.DetailLieu, 'noteMoyenne', 'DESC'],
          ['createdAt', 'DESC']
        ],
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: sites
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des sites populaires:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur' 
      });
    }
  }

  // Parcours patrimoniaux
  async getParcoursPatrimoniaux(req, res) {
    try {
      const { wilaya } = req.query;

      const whereClause = wilaya ? { wilayaId: wilaya } : {};

      const parcours = await this.models.Parcours.findAll({
        include: [
          {
            model: this.models.Lieu,
            through: { 
              model: this.models.ParcoursLieu,
              attributes: ['ordre']
            },
            where: whereClause,
            include: [
              {
                model: this.models.DetailLieu,
                required: true
              },
              {
                model: this.models.LieuMedia,
                where: { type: 'image' },
                required: false,
                limit: 1
              },
              {
                model: this.models.Wilaya,
                attributes: ['nom']
              }
            ]
          }
        ],
        order: [
          ['createdAt', 'DESC'],
          [this.models.Lieu, this.models.ParcoursLieu, 'ordre', 'ASC']
        ]
      });

      res.json({
        success: true,
        data: parcours
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des parcours:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur' 
      });
    }
  }
}

module.exports = PatrimoineController;