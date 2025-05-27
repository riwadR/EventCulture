module.exports = (sequelize, DataTypes) => {
  const ArticleScientifique = sequelize.define('ArticleScientifique', {
    id_article_scientifique: {
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
    journal: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Nom du journal ou de la revue scientifique'
    },
    doi: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      comment: 'Digital Object Identifier - identifiant unique de l\'article'
    },
    pages: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Pages de l\'article (ex: 123-145 ou p. 67-89)'
    },
    volume: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Volume de la revue'
    },
    numero: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Numéro de la revue'
    },
    issn: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'International Standard Serial Number du journal'
    },
    impact_factor: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: 'Facteur d\'impact du journal'
    },
    peer_reviewed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Article évalué par les pairs'
    },
    open_access: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Article en accès libre'
    },
    date_soumission: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date de soumission de l\'article'
    },
    date_acceptation: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date d\'acceptation de l\'article'
    },
    date_publication: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date de publication de l\'article'
    },
    // Les mots-clés seront gérés via la table TagMotCle liée à l'Oeuvre
    // Suppression du champ mots_cles pour utiliser la relation
    resume: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Résumé/Abstract de l\'article'
    },
    citation_apa: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Citation formatée selon les normes APA'
    },
    url_hal: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'URL vers HAL (Hyper Articles en Ligne) si applicable'
    },
    url_arxiv: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'URL vers arXiv si applicable'
    }
  }, {
    tableName: 'ArticleScientifique',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['doi']
      },
      {
        fields: ['journal']
      },
      {
        fields: ['date_publication']
      },
      {
        fields: ['peer_reviewed']
      }
    ]
  });

  ArticleScientifique.associate = (models) => {
    // Association avec Oeuvre
    ArticleScientifique.belongsTo(models.Oeuvre, { 
      foreignKey: 'id_oeuvre',
      as: 'Oeuvre'
    });

    // Les tags/mots-clés sont gérés via l'Oeuvre -> TagMotCle

    // Association Many-to-Many avec les auteurs si vous avez un modèle Auteur
    // ArticleScientifique.belongsToMany(models.Auteur, {
    //   through: 'ArticleAuteur',
    //   foreignKey: 'id_article_scientifique',
    //   otherKey: 'id_auteur',
    //   as: 'Auteurs'
    // });

    // Association avec les domaines de recherche si vous avez un modèle DomaineRecherche
    // ArticleScientifique.belongsToMany(models.DomaineRecherche, {
    //   through: 'ArticleDomaine',
    //   foreignKey: 'id_article_scientifique',
    //   otherKey: 'id_domaine',
    //   as: 'DomainesRecherche'
    // });

    // Association avec les citations si vous avez un modèle Citation
    // ArticleScientifique.hasMany(models.Citation, {
    //   foreignKey: 'id_article_cite',
    //   as: 'CitationsRecues'
    // });

    // ArticleScientifique.hasMany(models.Citation, {
    //   foreignKey: 'id_article_citant',
    //   as: 'CitationsFaites'
    // });
  };

  // Méthodes d'instance
  ArticleScientifique.prototype.genererCitationAPA = function() {
    // Génère automatiquement la citation APA
    // Cette méthode peut être appelée après la création/mise à jour
    const annee = this.date_publication ? new Date(this.date_publication).getFullYear() : 'n.d.';
    const titre = this.Oeuvre ? this.Oeuvre.titre : 'Titre non disponible';
    const journal = this.journal || 'Journal non spécifié';
    const volume = this.volume ? `${this.volume}` : '';
    const numero = this.numero ? `(${this.numero})` : '';
    const pages = this.pages ? `, ${this.pages}` : '';
    const doi = this.doi ? `. https://doi.org/${this.doi}` : '';

    return `Auteur, A. (${annee}). ${titre}. ${journal}, ${volume}${numero}${pages}${doi}`;
  };

  ArticleScientifique.prototype.estRecentementPublie = function() {
    if (!this.date_publication) return false;
    const maintenant = new Date();
    const datePublication = new Date(this.date_publication);
    const diffEnMois = (maintenant - datePublication) / (1000 * 60 * 60 * 24 * 30);
    return diffEnMois <= 12; // Considéré comme récent si publié dans les 12 derniers mois
  };

  // Méthodes de classe
  ArticleScientifique.findByDOI = function(doi) {
    return this.findOne({
      where: { doi: doi },
      include: ['Oeuvre']
    });
  };

  ArticleScientifique.findByJournal = function(journal, options = {}) {
    return this.findAll({
      where: { journal: journal },
      include: ['Oeuvre'],
      order: [['date_publication', 'DESC']],
      ...options
    });
  };

  ArticleScientifique.findRecentArticles = function(nombreMois = 12, options = {}) {
    const dateLimit = new Date();
    dateLimit.setMonth(dateLimit.getMonth() - nombreMois);

    return this.findAll({
      where: {
        date_publication: {
          [sequelize.Sequelize.Op.gte]: dateLimit
        }
      },
      include: ['Oeuvre'],
      order: [['date_publication', 'DESC']],
      ...options
    });
  };

  return ArticleScientifique;
};