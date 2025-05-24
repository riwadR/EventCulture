const { Oeuvre, TypeOeuvre, Langue, Livre, Film, AlbumMusical, OeuvreArt, Artisanat, Media, CritiqueEvaluation, Evenement } = require('../models');
const { Op } = require('sequelize');

// Créer une nouvelle oeuvre
const create = async (req, res) => {
    try {
      const {
        titre,
        id_type_oeuvre,
        id_langue,
        annee_creation,
        description,
        image_url
      } = req.body;

      // Validation des champs obligatoires
      if (!titre || !id_type_oeuvre || !id_langue) {
        return res.status(400).json({
          error: 'Les champs titre, id_type_oeuvre et id_langue sont obligatoires'
        });
      }

      const nouvelleOeuvre = await Oeuvre.create({
        titre,
        id_type_oeuvre,
        id_langue,
        annee_creation,
        description,
        image_url
      });

      res.status(201).json({
        message: 'Oeuvre créée avec succès',
        data: nouvelleOeuvre
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'oeuvre:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur',
        details: error.message
      });
  }
};

// Récupérer toutes les oeuvres avec pagination et filtres
const getAll = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      const { search, type_oeuvre, langue, annee_min, annee_max } = req.query;

      // Construction des filtres
      const whereClause = {};
      
      if (search) {
        whereClause[Op.or] = [
          { titre: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }
      
      if (type_oeuvre) {
        whereClause.id_type_oeuvre = type_oeuvre;
      }
      
      if (langue) {
        whereClause.id_langue = langue;
      }
      
      if (annee_min || annee_max) {
        whereClause.annee_creation = {};
        if (annee_min) whereClause.annee_creation[Op.gte] = parseInt(annee_min);
        if (annee_max) whereClause.annee_creation[Op.lte] = parseInt(annee_max);
      }

      const { count, rows } = await Oeuvre.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: TypeOeuvre,
            attributes: ['nom_type']
          },
          {
            model: Langue,
            attributes: ['nom_langue', 'code_langue']
          }
        ],
        limit,
        offset,
        order: [['date_creation', 'DESC']]
      });

      res.json({
        data: rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des oeuvres:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur',
        details: error.message
      });
  }
};

// Récupérer une oeuvre par ID avec toutes ses relations
const getById = async (req, res) => {
    try {
      const { id } = req.params;

      const oeuvre = await Oeuvre.findByPk(id, {
        include: [
          {
            model: TypeOeuvre,
            attributes: ['nom_type']
          },
          {
            model: Langue,
            attributes: ['nom_langue', 'code_langue']
          },
          {
            model: Livre,
            required: false
          },
          {
            model: Film,
            required: false
          },
          {
            model: AlbumMusical,
            required: false
          },
          {
            model: OeuvreArt,
            required: false
          },
          {
            model: Artisanat,
            required: false
          },
          {
            model: Media,
            required: false
          },
          {
            model: CritiqueEvaluation,
            required: false
          },
          {
            model: Evenement,
            as: 'EvenementsPresentation',
            required: false
          }
        ]
      });

      if (!oeuvre) {
        return res.status(404).json({
          error: 'Oeuvre non trouvée'
        });
      }

      res.json({
        message: 'Oeuvre récupérée avec succès',
        data: oeuvre
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'oeuvre:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur',
        details: error.message
      });
  }
};

// Mettre à jour une oeuvre
const update = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        titre,
        id_type_oeuvre,
        id_langue,
        annee_creation,
        description,
        image_url
      } = req.body;

      const oeuvre = await Oeuvre.findByPk(id);
      
      if (!oeuvre) {
        return res.status(404).json({
          error: 'Oeuvre non trouvée'
        });
      }

      await oeuvre.update({
        titre: titre || oeuvre.titre,
        id_type_oeuvre: id_type_oeuvre || oeuvre.id_type_oeuvre,
        id_langue: id_langue || oeuvre.id_langue,
        annee_creation: annee_creation !== undefined ? annee_creation : oeuvre.annee_creation,
        description: description !== undefined ? description : oeuvre.description,
        image_url: image_url !== undefined ? image_url : oeuvre.image_url
      });

      const oeuvreModifiee = await Oeuvre.findByPk(id, {
        include: [
          {
            model: TypeOeuvre,
            attributes: ['nom_type']
          },
          {
            model: Langue,
            attributes: ['nom_langue', 'code_langue']
          }
        ]
      });

      res.json({
        message: 'Oeuvre mise à jour avec succès',
        data: oeuvreModifiee
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'oeuvre:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur',
        details: error.message
      });
  }
};

// Supprimer une oeuvre
const deleteOeuvre = async (req, res) => {
    try {
      const { id } = req.params;

      const oeuvre = await Oeuvre.findByPk(id);
      
      if (!oeuvre) {
        return res.status(404).json({
          error: 'Oeuvre non trouvée'
        });
      }

      await oeuvre.destroy();

      res.json({
        message: 'Oeuvre supprimée avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'oeuvre:', error);
      
      // Gestion des erreurs de contraintes de clé étrangère
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
          error: 'Impossible de supprimer cette oeuvre car elle est référencée dans d\'autres tables'
        });
      }
      
      res.status(500).json({
        error: 'Erreur interne du serveur',
        details: error.message
      });
  }
};

// Récupérer les statistiques des oeuvres
const getStats = async (req, res) => {
    try {
      const stats = await Promise.all([
        // Total des oeuvres
        Oeuvre.count(),
        
        // Oeuvres par type
        Oeuvre.findAll({
          attributes: [
            'id_type_oeuvre',
            [Oeuvre.sequelize.fn('COUNT', Oeuvre.sequelize.col('id_oeuvre')), 'count']
          ],
          include: [{
            model: TypeOeuvre,
            attributes: ['nom_type']
          }],
          group: ['id_type_oeuvre', 'TypeOeuvre.id_type_oeuvre']
        }),
        
        // Oeuvres par langue
        Oeuvre.findAll({
          attributes: [
            'id_langue',
            [Oeuvre.sequelize.fn('COUNT', Oeuvre.sequelize.col('id_oeuvre')), 'count']
          ],
          include: [{
            model: Langue,
            attributes: ['nom_langue']
          }],
          group: ['id_langue', 'Langue.id_langue']
        }),
        
        // Oeuvres par décennie
        Oeuvre.findAll({
          attributes: [
            [Oeuvre.sequelize.fn('FLOOR', Oeuvre.sequelize.literal('annee_creation / 10')), 'decennie'],
            [Oeuvre.sequelize.fn('COUNT', Oeuvre.sequelize.col('id_oeuvre')), 'count']
          ],
          where: {
            annee_creation: {
              [Op.not]: null
            }
          },
          group: [Oeuvre.sequelize.fn('FLOOR', Oeuvre.sequelize.literal('annee_creation / 10'))],
          order: [[Oeuvre.sequelize.fn('FLOOR', Oeuvre.sequelize.literal('annee_creation / 10')), 'ASC']]
        })
      ]);

      res.json({
        message: 'Statistiques récupérées avec succès',
        data: {
          totalOeuvres: stats[0],
          parType: stats[1],
          parLangue: stats[2],
          parDecennie: stats[3]
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({
        error: 'Erreur interne du serveur',
        details: error.message
      });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteOeuvre,
  getStats
};