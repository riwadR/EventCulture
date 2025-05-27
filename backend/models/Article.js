module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    id_article: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_oeuvre: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Oeuvre',
        key: 'id_oeuvre'
      },
      onDelete: 'CASCADE'
    },
    auteur: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Nom de l\'auteur de l\'article'
    },
    source: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Source de publication (Le Monde, Le Figaro, blog, etc.)'
    },
    type_article: {
      type: DataTypes.ENUM('presse', 'blog', 'magazine', 'newsletter', 'communique', 'editorial', 'interview', 'reportage', 'autre'),
      defaultValue: 'presse',
      comment: 'Type d\'article'
    },
    categorie: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Catégorie de l\'article (politique, économie, sport, culture, etc.)'
    },
    sous_titre: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Sous-titre ou chapô de l\'article'
    },
    date_publication: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date de publication de l\'article'
    },
    date_derniere_modification: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date de dernière modification'
    },
    resume: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Résumé ou extrait de l\'article'
    },
    contenu_complet: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      comment: 'Contenu complet de l\'article'
    },
    url_source: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL originale de l\'article'
    },
    url_archive: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL archivée (Wayback Machine, etc.)'
    },
    statut: {
      type: DataTypes.ENUM('brouillon', 'publie', 'archive', 'supprime'),
      defaultValue: 'publie',
      comment: 'Statut de l\'article'
    },
    langue_contenu: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: 'Langue du contenu de l\'article (fr, en, es, etc.)'
    },
    nb_mots: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Nombre approximatif de mots'
    },
    temps_lecture: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Temps de lecture estimé en minutes'
    },
    niveau_credibilite: {
      type: DataTypes.ENUM('tres_fiable', 'fiable', 'moyen', 'peu_fiable', 'non_verifie'),
      defaultValue: 'non_verifie',
      comment: 'Niveau de crédibilité évalué'
    },
    fact_checked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Article vérifié par fact-checking'
    },
    paywall: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Article derrière un paywall'
    },
    nb_vues: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Nombre de vues (si disponible)'
    },
    nb_partages: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Nombre de partages sur les réseaux sociaux'
    },
    note_qualite: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 10
      },
      comment: 'Note de qualité sur 10'
    },
    commentaires_moderation: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Commentaires internes pour modération'
    }
  }, {
    tableName: 'Article',
    timestamps: true,
    createdAt: 'date_creation',
    updatedAt: 'date_modification',
    indexes: [
      {
        fields: ['auteur']
      },
      {
        fields: ['source']
      },
      {
        fields: ['date_publication']
      },
      {
        fields: ['type_article']
      },
      {
        fields: ['categorie']
      },
      {
        fields: ['statut']
      },
      {
        fields: ['niveau_credibilite']
      },
      {
        name: 'idx_article_contenu',
        fields: ['contenu_complet'],
        type: 'FULLTEXT'
      }
    ]
  });

  Article.associate = (models) => {
    // Association avec Oeuvre
    Article.belongsTo(models.Oeuvre, { 
      foreignKey: 'id_oeuvre',
      as: 'Oeuvre'
    });

    // Les tags sont gérés via Oeuvre -> TagMotCle (relation Many-to-Many)
    // Pas besoin d'association directe ici car elle passe par l'Oeuvre

    // Associations optionnelles pour extensions futures
    // Article.belongsTo(models.Journaliste, {
    //   foreignKey: 'id_journaliste',
    //   as: 'Journaliste'
    // });

    // Article.belongsTo(models.Publication, {
    //   foreignKey: 'id_publication',
    //   as: 'Publication'
    // });

    // Article.hasMany(models.Commentaire, {
    //   foreignKey: 'id_article',
    //   as: 'Commentaires'
    // });

    // Article.hasMany(models.Reaction, {
    //   foreignKey: 'id_article',
    //   as: 'Reactions'
    // });
  };

  // ====================================
  // MÉTHODES D'INSTANCE
  // ====================================

  Article.prototype.calculerTempsLecture = function() {
    if (this.nb_mots) {
      // Vitesse moyenne de lecture : 200 mots par minute
      this.temps_lecture = Math.ceil(this.nb_mots / 200);
      return this.temps_lecture;
    }
    return null;
  };

  Article.prototype.estRecent = function(joursLimit = 7) {
    if (!this.date_publication) return false;
    const maintenant = new Date();
    const datePublication = new Date(this.date_publication);
    const diffEnJours = (maintenant - datePublication) / (1000 * 60 * 60 * 24);
    return diffEnJours <= joursLimit;
  };

  Article.prototype.genererExtrait = function(longueur = 200) {
    if (this.contenu_complet) {
      const texte = this.contenu_complet.replace(/<[^>]*>/g, ''); // Supprimer HTML
      return texte.length > longueur 
        ? texte.substring(0, longueur) + '...'
        : texte;
    }
    return this.resume || '';
  };

  // Méthodes pour gérer les tags via l'Oeuvre
  Article.prototype.ajouterTags = async function(nomsTags) {
    if (!Array.isArray(nomsTags)) {
      nomsTags = [nomsTags];
    }

    const oeuvre = await this.getOeuvre();
    if (!oeuvre) throw new Error('Oeuvre non trouvée');

    const tags = [];
    for (const nomTag of nomsTags) {
      const [tag] = await sequelize.models.TagMotCle.findOrCreate({
        where: { nom: nomTag.trim() }
      });
      tags.push(tag);
    }

    // Associer les tags à l'œuvre via la table de liaison OeuvreTag
    const associations = tags.map(tag => ({
      id_oeuvre: oeuvre.id_oeuvre,
      id_tag: tag.id_tag
    }));

    await sequelize.models.OeuvreTag.bulkCreate(associations, {
      ignoreDuplicates: true
    });

    return tags;
  };

  Article.prototype.supprimerTag = async function(nomTag) {
    const oeuvre = await this.getOeuvre();
    if (!oeuvre) return false;

    const tag = await sequelize.models.TagMotCle.findOne({
      where: { nom: nomTag }
    });

    if (tag) {
      await sequelize.models.OeuvreTag.destroy({
        where: {
          id_oeuvre: oeuvre.id_oeuvre,
          id_tag: tag.id_tag
        }
      });
      return true;
    }
    return false;
  };

  Article.prototype.getTags = async function() {
    const oeuvre = await this.getOeuvre({
      include: [{
        model: sequelize.models.TagMotCle,
        as: 'TagMotCles',
        through: { attributes: [] }
      }]
    });
    
    return oeuvre ? oeuvre.TagMotCles : [];
  };

  Article.prototype.incrementerVues = async function() {
    this.nb_vues += 1;
    await this.save();
    return this;
  };

  Article.prototype.incrementerPartages = async function() {
    this.nb_partages += 1;
    await this.save();
    return this;
  };

  // ====================================
  // MÉTHODES DE CLASSE
  // ====================================

  Article.findByAuteur = function(auteur, options = {}) {
    return this.findAll({
      where: { auteur: auteur },
      include: [{
        model: sequelize.models.Oeuvre,
        as: 'Oeuvre',
        include: [{
          model: sequelize.models.TagMotCle,
          as: 'TagMotCles',
          through: { attributes: [] }
        }]
      }],
      order: [['date_publication', 'DESC']],
      ...options
    });
  };

  Article.findBySource = function(source, options = {}) {
    return this.findAll({
      where: { source: source },
      include: [{
        model: sequelize.models.Oeuvre,
        as: 'Oeuvre',
        include: [{
          model: sequelize.models.TagMotCle,
          as: 'TagMotCles',
          through: { attributes: [] }
        }]
      }],
      order: [['date_publication', 'DESC']],
      ...options
    });
  };

  Article.findByCategorie = function(categorie, options = {}) {
    return this.findAll({
      where: { categorie: categorie },
      include: [{
        model: sequelize.models.Oeuvre,
        as: 'Oeuvre',
        include: [{
          model: sequelize.models.TagMotCle,
          as: 'TagMotCles',
          through: { attributes: [] }
        }]
      }],
      order: [['date_publication', 'DESC']],
      ...options
    });
  };

  Article.findRecents = function(nombreJours = 7, options = {}) {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - nombreJours);

    return this.findAll({
      where: {
        date_publication: {
          [sequelize.Sequelize.Op.gte]: dateLimit
        },
        statut: 'publie'
      },
      include: [{
        model: sequelize.models.Oeuvre,
        as: 'Oeuvre',
        include: [{
          model: sequelize.models.TagMotCle,
          as: 'TagMotCles',
          through: { attributes: [] }
        }]
      }],
      order: [['date_publication', 'DESC']],
      ...options
    });
  };

  Article.searchByKeywords = function(keywords, options = {}) {
    const keywordArray = keywords.split(' ').map(k => k.trim());
    
    return this.findAll({
      include: [{
        model: sequelize.models.Oeuvre,
        as: 'Oeuvre',
        include: [{
          model: sequelize.models.TagMotCle,
          as: 'TagMotCles',
          where: {
            nom: {
              [sequelize.Sequelize.Op.in]: keywordArray
            }
          },
          through: { attributes: [] },
          required: false
        }]
      }],
      where: {
        [sequelize.Sequelize.Op.or]: [
          { '$Oeuvre.titre$': { [sequelize.Sequelize.Op.like]: `%${keywords}%` } },
          { contenu_complet: { [sequelize.Sequelize.Op.like]: `%${keywords}%` } },
          { resume: { [sequelize.Sequelize.Op.like]: `%${keywords}%` } },
          { auteur: { [sequelize.Sequelize.Op.like]: `%${keywords}%` } }
        ],
        statut: 'publie'
      },
      order: [['date_publication', 'DESC']],
      ...options
    });
  };

  Article.findByTags = function(tagNames, options = {}) {
    return this.findAll({
      include: [{
        model: sequelize.models.Oeuvre,
        as: 'Oeuvre',
        include: [{
          model: sequelize.models.TagMotCle,
          as: 'TagMotCles',
          where: {
            nom: {
              [sequelize.Sequelize.Op.in]: tagNames
            }
          },
          through: { attributes: [] }
        }]
      }],
      where: {
        statut: 'publie'
      },
      order: [['date_publication', 'DESC']],
      ...options
    });
  };

  Article.getStatistiques = function() {
    return Promise.all([
      // Total d'articles
      this.count(),
      
      // Par type
      this.findAll({
        attributes: [
          'type_article', 
          [sequelize.fn('COUNT', '*'), 'count']
        ],
        group: ['type_article']
      }),
      
      // Par catégorie
      this.findAll({
        attributes: [
          'categorie', 
          [sequelize.fn('COUNT', '*'), 'count']
        ],
        group: ['categorie'],
        where: {
          categorie: { [sequelize.Sequelize.Op.ne]: null }
        }
      }),
      
      // Par niveau de crédibilité
      this.findAll({
        attributes: [
          'niveau_credibilite', 
          [sequelize.fn('COUNT', '*'), 'count']
        ],
        group: ['niveau_credibilite']
      }),

      // Articles les plus vus
      this.findAll({
        attributes: ['id_article', 'nb_vues'],
        include: [{
          model: sequelize.models.Oeuvre,
          as: 'Oeuvre',
          attributes: ['titre']
        }],
        order: [['nb_vues', 'DESC']],
        limit: 10
      })
    ]).then(([total, parType, parCategorie, parCredibilite, plusVus]) => ({
      total,
      parType,
      parCategorie,
      parCredibilite,
      plusVus
    }));
  };

  // ====================================
  // HOOKS
  // ====================================

  // Hook avant sauvegarde pour calculer automatiquement certains champs
  Article.addHook('beforeSave', (article) => {
    // Calculer le nombre de mots si le contenu est présent
    if (article.contenu_complet) {
      const mots = article.contenu_complet
        .replace(/<[^>]*>/g, '') // Supprimer HTML
        .split(/\s+/)
        .filter(mot => mot.length > 0);
      
      article.nb_mots = mots.length;
      article.calculerTempsLecture();
    }

    // Mettre à jour la date de dernière modification
    if (article.changed() && !article.isNewRecord) {
      article.date_derniere_modification = new Date();
    }
  });

  // Hook après création pour initialiser certaines valeurs
  Article.addHook('afterCreate', (article) => {
    console.log(`Nouvel article créé: ${article.id_article}`);
  });

  return Article;
};