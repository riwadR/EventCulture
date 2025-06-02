const { Op } = require('sequelize');

class OeuvreController {
  constructor(models) {
    this.models = models;
  }

  // Récupérer toutes les œuvres avec pagination et filtres
  async getAllOeuvres(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        type, 
        langue, 
        statut = 'publie',
        annee_min,
        annee_max,
        auteur,
        search
      } = req.query;

      const offset = (page - 1) * limit;
      const where = {};

      // Filtres
      if (type) where.id_type_oeuvre = type;
      if (langue) where.id_langue = langue;
      if (statut) where.statut = statut;
      if (annee_min || annee_max) {
        where.annee_creation = {};
        if (annee_min) where.annee_creation[Op.gte] = parseInt(annee_min);
        if (annee_max) where.annee_creation[Op.lte] = parseInt(annee_max);
      }

      // Recherche textuelle
      if (search) {
        where[Op.or] = [
          { titre: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }

      // Inclusions pour les relations
      const include = [
        { 
          model: this.models.TypeOeuvre,
          attributes: ['nom_type', 'description']
        },
        { 
          model: this.models.Langue,
          attributes: ['nom', 'code']
        },
        { 
          model: this.models.User, 
          as: 'Saiseur', 
          attributes: ['nom', 'prenom', 'type_user']
        },
        {
          model: this.models.User,
          through: { 
            model: this.models.OeuvreUser,
            where: auteur ? { role_dans_oeuvre: 'auteur' } : undefined
          },
          attributes: ['nom', 'prenom'],
          required: !!auteur
        },
        {
          model: this.models.Categorie,
          through: { model: this.models.OeuvreCategorie },
          attributes: ['nom']
        }
      ];

      const oeuvres = await this.models.Oeuvre.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include,
        order: [['date_creation', 'DESC']],
        distinct: true
      });

      res.json({
        success: true,
        data: {
          oeuvres: oeuvres.rows,
          pagination: {
            total: oeuvres.count,
            page: parseInt(page),
            pages: Math.ceil(oeuvres.count / limit),
            limit: parseInt(limit)
          }
        }
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des œuvres:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la récupération des œuvres' 
      });
    }
  }

  // Récupérer une œuvre par ID
  async getOeuvreById(req, res) {
    try {
      const { id } = req.params;

      const oeuvre = await this.models.Oeuvre.findByPk(id, {
        include: [
          { model: this.models.TypeOeuvre },
          { model: this.models.Langue },
          { model: this.models.User, as: 'Saiseur', attributes: ['nom', 'prenom'] },
          { model: this.models.User, as: 'Validateur', attributes: ['nom', 'prenom'] },
          { 
            model: this.models.User,
            through: { 
              model: this.models.OeuvreUser,
              attributes: ['role_dans_oeuvre', 'role_principal', 'personnage']
            },
            attributes: ['nom', 'prenom', 'type_user']
          },
          {
            model: this.models.Categorie,
            through: { model: this.models.OeuvreCategorie },
            attributes: ['nom']
          },
          {
            model: this.models.TagMotCle,
            through: { model: this.models.OeuvreTag },
            attributes: ['nom']
          },
          {
            model: this.models.Editeur,
            through: { 
              model: this.models.OeuvreEditeur,
              attributes: ['role_editeur', 'date_edition', 'format']
            },
            attributes: ['nom', 'type_editeur']
          },
          { model: this.models.Livre },
          { model: this.models.Film },
          { model: this.models.AlbumMusical },
          { model: this.models.Article },
          { model: this.models.ArticleScientifique },
          { model: this.models.Artisanat },
          { model: this.models.OeuvreArt },
          { model: this.models.Media },
          { 
            model: this.models.CritiqueEvaluation,
            include: [
              { model: this.models.User, attributes: ['nom', 'prenom'] }
            ]
          }
        ]
      });

      if (!oeuvre) {
        return res.status(404).json({ 
          success: false, 
          error: 'Œuvre non trouvée' 
        });
      }

      res.json({
        success: true,
        data: oeuvre
      });

    } catch (error) {
      console.error('Erreur lors de la récupération de l\'œuvre:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la récupération de l\'œuvre' 
      });
    }
  }

  // Créer une nouvelle œuvre
  async createOeuvre(req, res) {
    const transaction = await this.models.sequelize.transaction();

    try {
      const {
        titre,
        id_type_oeuvre,
        id_langue,
        annee_creation,
        description,
        categories = [],
        tags = [],
        auteurs = [],
        details_specifiques = {}
      } = req.body;

      // Validation des champs obligatoires
      if (!titre || !id_type_oeuvre || !id_langue) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          error: 'Les champs titre, type d\'œuvre et langue sont obligatoires'
        });
      }

      // Créer l'œuvre principale
      const oeuvre = await this.models.Oeuvre.create({
        titre,
        id_type_oeuvre,
        id_langue,
        annee_creation,
        description,
        saisi_par: req.user?.id_user,
        statut: 'brouillon'
      }, { transaction });

      // Ajouter les catégories
      if (categories.length > 0) {
        const categoriesExistantes = await this.models.Categorie.findAll({
          where: { id_categorie: { [Op.in]: categories } }
        });
        await oeuvre.addCategories(categoriesExistantes, { transaction });
      }

      // Ajouter les tags
      if (tags.length > 0) {
        for (const tagNom of tags) {
          const [tag] = await this.models.TagMotCle.findOrCreate({
            where: { nom: tagNom },
            defaults: { nom: tagNom },
            transaction
          });
          await oeuvre.addTagMotCles([tag], { transaction });
        }
      }

      // Ajouter les auteurs/contributeurs
      if (auteurs.length > 0) {
        for (const auteur of auteurs) {
          await this.models.OeuvreUser.create({
            id_oeuvre: oeuvre.id_oeuvre,
            id_user: auteur.id_user,
            role_dans_oeuvre: auteur.role || 'auteur',
            role_principal: auteur.role_principal || false,
            personnage: auteur.personnage,
            description_role: auteur.description_role
          }, { transaction });
        }
      }

      // Créer les détails spécifiques selon le type
      const typeOeuvre = await this.models.TypeOeuvre.findByPk(id_type_oeuvre);
      if (typeOeuvre && details_specifiques) {
        switch (typeOeuvre.nom_type.toLowerCase()) {
          case 'livre':
            if (details_specifiques.livre) {
              await this.models.Livre.create({
                id_oeuvre: oeuvre.id_oeuvre,
                ...details_specifiques.livre
              }, { transaction });
            }
            break;
          case 'film':
            if (details_specifiques.film) {
              await this.models.Film.create({
                id_oeuvre: oeuvre.id_oeuvre,
                ...details_specifiques.film
              }, { transaction });
            }
            break;
          case 'album musical':
            if (details_specifiques.album) {
              await this.models.AlbumMusical.create({
                id_oeuvre: oeuvre.id_oeuvre,
                ...details_specifiques.album
              }, { transaction });
            }
            break;
          // Ajouter d'autres cas selon les besoins
        }
      }

      await transaction.commit();

      // Récupérer l'œuvre complète pour la réponse
      const oeuvreComplete = await this.getOeuvreComplete(oeuvre.id_oeuvre);

      res.status(201).json({
        success: true,
        message: 'Œuvre créée avec succès',
        data: oeuvreComplete
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Erreur lors de la création de l\'œuvre:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la création de l\'œuvre' 
      });
    }
  }

  // Mettre à jour une œuvre
  async updateOeuvre(req, res) {
    const transaction = await this.models.sequelize.transaction();

    try {
      const { id } = req.params;
      const updates = req.body;

      const oeuvre = await this.models.Oeuvre.findByPk(id);
      if (!oeuvre) {
        await transaction.rollback();
        return res.status(404).json({ 
          success: false, 
          error: 'Œuvre non trouvée' 
        });
      }

      // Vérifier les permissions (si nécessaire)
      if (req.user && oeuvre.saisi_par !== req.user.id_user && !req.user.isAdmin) {
        await transaction.rollback();
        return res.status(403).json({ 
          success: false, 
          error: 'Accès refusé' 
        });
      }

      // Mettre à jour les champs de base
      await oeuvre.update(updates, { transaction });

      // Mettre à jour les relations si fournies
      if (updates.categories) {
        await oeuvre.setCategories(updates.categories, { transaction });
      }

      if (updates.tags) {
        const tags = [];
        for (const tagNom of updates.tags) {
          const [tag] = await this.models.TagMotCle.findOrCreate({
            where: { nom: tagNom },
            defaults: { nom: tagNom },
            transaction
          });
          tags.push(tag);
        }
        await oeuvre.setTagMotCles(tags, { transaction });
      }

      await transaction.commit();

      const oeuvreComplete = await this.getOeuvreComplete(id);

      res.json({
        success: true,
        message: 'Œuvre mise à jour avec succès',
        data: oeuvreComplete
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Erreur lors de la mise à jour de l\'œuvre:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la mise à jour de l\'œuvre' 
      });
    }
  }

  // Supprimer une œuvre (soft delete)
  async deleteOeuvre(req, res) {
    try {
      const { id } = req.params;

      const oeuvre = await this.models.Oeuvre.findByPk(id);
      if (!oeuvre) {
        return res.status(404).json({ 
          success: false, 
          error: 'Œuvre non trouvée' 
        });
      }

      // Vérifier les permissions
      if (req.user && oeuvre.saisi_par !== req.user.id_user && !req.user.isAdmin) {
        return res.status(403).json({ 
          success: false, 
          error: 'Accès refusé' 
        });
      }

      // Soft delete
      await oeuvre.update({ statut: 'supprime' });

      res.json({
        success: true,
        message: 'Œuvre supprimée avec succès'
      });

    } catch (error) {
      console.error('Erreur lors de la suppression de l\'œuvre:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la suppression de l\'œuvre' 
      });
    }
  }

  // Valider une œuvre
  async validateOeuvre(req, res) {
    try {
      const { id } = req.params;
      const { statut, raison_rejet } = req.body;

      if (!['publie', 'rejete'].includes(statut)) {
        return res.status(400).json({
          success: false,
          error: 'Statut invalide. Doit être "publie" ou "rejete"'
        });
      }

      const oeuvre = await this.models.Oeuvre.findByPk(id);
      if (!oeuvre) {
        return res.status(404).json({ 
          success: false, 
          error: 'Œuvre non trouvée' 
        });
      }

      const updateData = {
        statut,
        validateur_id: req.user?.id_user,
        date_validation: new Date()
      };

      if (statut === 'rejete' && raison_rejet) {
        updateData.raison_rejet = raison_rejet;
      }

      await oeuvre.update(updateData);

      res.json({
        success: true,
        message: `Œuvre ${statut === 'publie' ? 'publiée' : 'rejetée'} avec succès`,
        data: oeuvre
      });

    } catch (error) {
      console.error('Erreur lors de la validation de l\'œuvre:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la validation de l\'œuvre' 
      });
    }
  }

  // Recherche avancée
  async searchOeuvres(req, res) {
    try {
      const { 
        q, // terme de recherche général
        type,
        langue,
        auteur,
        annee_debut,
        annee_fin,
        categories,
        tags,
        limit = 20
      } = req.query;

      const where = {};
      const include = [
        { model: this.models.TypeOeuvre },
        { model: this.models.Langue },
        {
          model: this.models.User,
          through: { model: this.models.OeuvreUser },
          attributes: ['nom', 'prenom']
        },
        {
          model: this.models.Categorie,
          through: { model: this.models.OeuvreCategorie },
          attributes: ['nom']
        }
      ];

      // Recherche textuelle générale
      if (q) {
        where[Op.or] = [
          { titre: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } }
        ];
      }

      // Filtres spécifiques
      if (type) where.id_type_oeuvre = type;
      if (langue) where.id_langue = langue;
      if (annee_debut || annee_fin) {
        where.annee_creation = {};
        if (annee_debut) where.annee_creation[Op.gte] = parseInt(annee_debut);
        if (annee_fin) where.annee_creation[Op.lte] = parseInt(annee_fin);
      }

      // Statut par défaut
      where.statut = 'publie';

      const oeuvres = await this.models.Oeuvre.findAll({
        where,
        include,
        limit: parseInt(limit),
        order: [
          // Pertinence : œuvres avec titre correspondant en premier
          q ? [this.models.sequelize.literal(`CASE WHEN titre LIKE '%${q}%' THEN 0 ELSE 1 END`)] : ['date_creation', 'DESC']
        ]
      });

      res.json({
        success: true,
        data: oeuvres,
        count: oeuvres.length
      });

    } catch (error) {
      console.error('Erreur lors de la recherche d\'œuvres:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur serveur lors de la recherche' 
      });
    }
  }

  // Méthode utilitaire pour récupérer une œuvre complète
  async getOeuvreComplete(id) {
    return await this.models.Oeuvre.findByPk(id, {
      include: [
        { model: this.models.TypeOeuvre },
        { model: this.models.Langue },
        { model: this.models.User, as: 'Saiseur', attributes: ['nom', 'prenom'] },
        {
          model: this.models.Categorie,
          through: { model: this.models.OeuvreCategorie },
          attributes: ['nom']
        },
        {
          model: this.models.TagMotCle,
          through: { model: this.models.OeuvreTag },
          attributes: ['nom']
        }
      ]
    });
  }
}

module.exports = OeuvreController;
