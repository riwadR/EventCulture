module.exports = (sequelize, DataTypes) => {

const Oeuvre = sequelize.define(
    "Oeuvre",
    {
      id_oeuvre: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      titre: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      id_type_oeuvre: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Type_Oeuvre",
          key: "id_type_oeuvre",
        },
        onDelete: "RESTRICT",
      },
      id_langue: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Langue",
          key: "id_langue",
        },
        onDelete: "RESTRICT",
      },
      annee_creation: {
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.TEXT,
      },
      saisi_par: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "User",
          key: "id_user",
        },
        onDelete: "SET NULL",
        comment: 'Utilisateur qui a enregistré cette œuvre dans le système'
      },
      id_oeuvre_originale: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Oeuvre",
          key: "id_oeuvre",
        },
        onDelete: "SET NULL",
        comment: "Référence à l'œuvre originale si cette entrée est une traduction",
      },
    },
    {
      tableName: "Oeuvre",
      createdAt: "date_creation",
      updatedAt: "date_modification",
      indexes: [
        {
          unique: true,
          fields: ["titre", "id_langue", "id_oeuvre_originale"],
          name: "uniq_titre_langue_originale"
        }
      ]
    }
  );

  Oeuvre.associate = (models) => {
    // Type et Langue
    Oeuvre.belongsTo(models.TypeOeuvre, { foreignKey: "id_type_oeuvre" });
    Oeuvre.belongsTo(models.Langue, { foreignKey: "id_langue" });
    
    // Utilisateur qui a saisi l'œuvre
    Oeuvre.belongsTo(models.User, { 
      foreignKey: "saisi_par",
      as: "SaisiPar"
    });

    // Types d'œuvres spécifiques
    Oeuvre.hasOne(models.Livre, { foreignKey: "id_oeuvre" });
    Oeuvre.hasOne(models.Film, { foreignKey: "id_oeuvre" });
    Oeuvre.hasOne(models.AlbumMusical, { foreignKey: "id_oeuvre" });
    Oeuvre.hasOne(models.OeuvreArt, { foreignKey: "id_oeuvre" });
    Oeuvre.hasOne(models.Artisanat, { foreignKey: "id_oeuvre" });
    Oeuvre.hasOne(models.Article, { foreignKey: "id_oeuvre" });
    Oeuvre.hasOne(models.ArticleScientifique, { foreignKey: "id_oeuvre" });

    // Médias et critiques
    Oeuvre.hasMany(models.Media, { foreignKey: "id_oeuvre" });
    Oeuvre.hasMany(models.CritiqueEvaluation, { foreignKey: "id_oeuvre" });

    // Événements
    Oeuvre.belongsToMany(models.Evenement, {
      through: models.EvenementOeuvre,
      foreignKey: "id_oeuvre",
      as: "EvenementsPresentation",
    });

    // Tags/Mots-clés (Many-to-Many)
    Oeuvre.belongsToMany(models.TagMotCle, {
      through: models.OeuvreTag,
      foreignKey: "id_oeuvre",
      otherKey: "id_tag",
      as: "TagMotCles"
    });

    // Catégories (Many-to-Many)
    Oeuvre.belongsToMany(models.Categorie, {
      through: models.OeuvreCategorie,
      foreignKey: "id_oeuvre",
      otherKey: "id_categorie",
      as: "Categories"
    });

    // Éditeurs (Many-to-Many)
    Oeuvre.belongsToMany(models.Editeur, {
      through: models.OeuvreEditeur,
      foreignKey: "id_oeuvre",
      otherKey: "id_editeur",
      as: "Editeurs"
    });

    // Utilisateurs/Participants (Many-to-Many)
    Oeuvre.belongsToMany(models.User, {
      through: models.OeuvreUser,
      foreignKey: "id_oeuvre",
      otherKey: "id_user",
      as: "Participants"
    });

    // ==========================
    // Traductions (self-referencing)
    // ==========================
    Oeuvre.belongsTo(models.Oeuvre, {
      foreignKey: "id_oeuvre_originale",
      as: "Originale"
    });
    Oeuvre.hasMany(models.Oeuvre, {
      foreignKey: "id_oeuvre_originale",
      as: "Traductions"
    });
  };

// ====================================
// MÉTHODES D'INSTANCE
// ====================================

// Obtenir tous les participants d'une œuvre
Oeuvre.prototype.getParticipants = async function(roleFilter = null) {
  const whereClause = roleFilter ? { role_dans_oeuvre: roleFilter } : {};
  
  return await this.getParticipants({
    through: {
      where: whereClause,
      attributes: ['role_dans_oeuvre', 'personnage', 'ordre_apparition', 'role_principal', 'description_role']
    },
    order: [['OeuvreUser', 'ordre_apparition', 'ASC']]
  });
};

// Obtenir les auteurs/créateurs principaux
Oeuvre.prototype.getCreateurs = async function() {
  const rolesCreateurs = ['auteur', 'realisateur', 'musicien', 'artiste', 'artisan', 'scientifique', 'journaliste'];
  
  return await this.getParticipants({
    through: {
      where: {
        role_dans_oeuvre: rolesCreateurs,
        role_principal: true
      }
    }
  });
};

// Ajouter un participant
Oeuvre.prototype.ajouterParticipant = async function(userId, options = {}) {
  const {
    role_dans_oeuvre,
    personnage = null,
    ordre_apparition = null,
    role_principal = false,
    description_role = null
  } = options;

  if (!role_dans_oeuvre) {
    throw new Error('Le rôle dans l\'œuvre est requis');
  }

  return await sequelize.models.OeuvreUser.create({
    id_oeuvre: this.id_oeuvre,
    id_user: userId,
    role_dans_oeuvre,
    personnage,
    ordre_apparition,
    role_principal,
    description_role
  });
};

// Ajouter un éditeur
Oeuvre.prototype.ajouterEditeur = async function(editeurId, options = {}) {
  const {
    role_editeur = 'editeur_principal',
    date_edition = null,
    isbn_editeur = null,
    tirage = null,
    prix_vente = null,
    langue_edition = null,
    format = null,
    notes = null
  } = options;

  return await sequelize.models.OeuvreEditeur.create({
    id_oeuvre: this.id_oeuvre,
    id_editeur: editeurId,
    role_editeur,
    date_edition,
    isbn_editeur,
    tirage,
    prix_vente,
    langue_edition,
    format,
    notes
  });
};

// Ajouter des tags
Oeuvre.prototype.ajouterTags = async function(tagNames) {
  if (!Array.isArray(tagNames)) {
    tagNames = [tagNames];
  }

  const tags = [];
  for (const nomTag of tagNames) {
    const [tag] = await sequelize.models.TagMotCle.findOrCreate({
      where: { nom: nomTag.trim() }
    });
    tags.push(tag);
  }

  const associations = tags.map(tag => ({
    id_oeuvre: this.id_oeuvre,
    id_tag: tag.id_tag
  }));

  await sequelize.models.OeuvreTag.bulkCreate(associations, {
    ignoreDuplicates: true
  });

  return tags;
};

// Obtenir l'œuvre complète avec toutes ses relations
Oeuvre.prototype.getOeuvreComplete = async function() {
  return await Oeuvre.findByPk(this.id_oeuvre, {
    include: [
      // Informations de base
      { model: sequelize.models.TypeOeuvre, as: 'TypeOeuvre' },
      { model: sequelize.models.Langue, as: 'Langue' },
      { model: sequelize.models.User, as: 'SaisiPar', attributes: ['id_user', 'nom', 'prenom'] },

      // Types spécifiques
      { model: sequelize.models.Livre, required: false },
      { model: sequelize.models.Film, required: false },
      { model: sequelize.models.AlbumMusical, required: false },
      { model: sequelize.models.OeuvreArt, required: false },
      { model: sequelize.models.Artisanat, required: false },
      { model: sequelize.models.Article, required: false },
      { model: sequelize.models.ArticleScientifique, required: false },

      // Relations Many-to-Many
      {
        model: sequelize.models.TagMotCle,
        as: 'TagMotCles',
        through: { attributes: [] }
      },
      {
        model: sequelize.models.Categorie,
        as: 'Categories',
        through: { attributes: [] }
      },
      {
        model: sequelize.models.User,
        as: 'Participants',
        through: {
          attributes: ['role_dans_oeuvre', 'personnage', 'ordre_apparition', 'role_principal']
        }
      },
      {
        model: sequelize.models.Editeur,
        as: 'Editeurs',
        through: {
          attributes: ['role_editeur', 'date_edition', 'isbn_editeur', 'prix_vente', 'format']
        }
      },

      // Médias
      { model: sequelize.models.Media }
    ]
  });
};

// ====================================
// MÉTHODES DE CLASSE
// ====================================

// Rechercher des œuvres par créateur
Oeuvre.findByCreateur = function(userId, options = {}) {
  return this.findAll({
    include: [
      {
        model: sequelize.models.User,
        as: 'Participants',
        where: { id_user: userId },
        through: {
          where: {
            role_dans_oeuvre: ['auteur', 'realisateur', 'musicien', 'artiste', 'artisan', 'scientifique', 'journaliste']
          }
        }
      }
    ],
    ...options
  });
};

// Rechercher par tags
Oeuvre.findByTags = function(tagNames, options = {}) {
  return this.findAll({
    include: [
      {
        model: sequelize.models.TagMotCle,
        as: 'TagMotCles',
        where: {
          nom: { [sequelize.Sequelize.Op.in]: tagNames }
        },
        through: { attributes: [] }
      }
    ],
    ...options
  });
};

// Rechercher par éditeur
Oeuvre.findByEditeur = function(editeurId, options = {}) {
  return this.findAll({
    include: [
      {
        model: sequelize.models.Editeur,
        as: 'Editeurs',
        where: { id_editeur: editeurId },
        through: { attributes: ['role_editeur', 'date_edition'] }
      }
    ],
    ...options
  });
};

// Statistiques générales
Oeuvre.getStatistiques = async function() {
  return {
    total: await this.count(),
    parType: await this.findAll({
      attributes: [
        [sequelize.col('TypeOeuvre.nom_type'), 'type'],
        [sequelize.fn('COUNT', '*'), 'count']
      ],
      include: [{ model: sequelize.models.TypeOeuvre, attributes: [] }],
      group: ['TypeOeuvre.id_type_oeuvre'],
      raw: true
    }),
    parLangue: await this.findAll({
      attributes: [
        [sequelize.col('Langue.nom'), 'langue'],
        [sequelize.fn('COUNT', '*'), 'count']
      ],
      include: [{ model: sequelize.models.Langue, attributes: [] }],
      group: ['Langue.id_langue'],
      raw: true
    }),
    parAnnee: await this.findAll({
      attributes: [
        'annee_creation',
        [sequelize.fn('COUNT', '*'), 'count']
      ],
      where: {
        annee_creation: { [sequelize.Sequelize.Op.ne]: null }
      },
      group: ['annee_creation'],
      order: [['annee_creation', 'DESC']],
      limit: 10,
      raw: true
    })
  };
};

return Oeuvre; }