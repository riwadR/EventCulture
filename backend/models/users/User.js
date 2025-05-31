const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    prenom: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    date_naissance: {
      type: DataTypes.DATEONLY
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    biographie: {
      type: DataTypes.TEXT
    },
    photo_url: {
      type: DataTypes.STRING(255)
    },
    type_user: {
      type: DataTypes.ENUM('ecrivain', 'journaliste', 'scientifique', 'acteur', 'artiste', 'artisan', 'realisateur', 'musicien', 'photographe', 'danseur', 'sculpteur', 'visiteur'),
      allowNull: false,
      defaultValue: 'visiteur'
    },
    telephone: {
      type: DataTypes.STRING(20)
    },
    // Nouveaux champs pour la gestion des professionnels
    professionnel_valide: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Indique si le professionnel a été validé par un admin'
    },
    date_validation_professionnel: {
      type: DataTypes.DATE,
      comment: 'Date de validation du statut professionnel'
    },
    validateur_professionnel_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id_user'
      },
      comment: 'Admin qui a validé le professionnel'
    },
    documents_justificatifs: {
      type: DataTypes.JSON,
      comment: 'URLs des documents justificatifs pour les professionnels'
    },
    statut_compte: {
      type: DataTypes.ENUM('actif', 'suspendu', 'en_attente_validation', 'desactive'),
      defaultValue: 'actif'
    }
  }, {
    tableName: 'user',
    timestamps: true,
    createdAt: 'date_creation',
    updatedAt: 'date_modification'
  });

  // Associations
  User.associate = (models) => {
    // Relations avec les rôles
    User.belongsToMany(models.Role, { 
      through: models.UserRole, 
      foreignKey: 'id_user' 
    });
    
    // Relations avec les organisations
    User.belongsToMany(models.Organisation, { 
      through: models.UserOrganisation, 
      foreignKey: 'id_user' 
    });
    
    // Relations avec les œuvres
    User.belongsToMany(models.Oeuvre, { 
      through: models.OeuvreUser, 
      foreignKey: 'id_user' 
    });
    
    // Relations avec les événements
    User.belongsToMany(models.Evenement, { 
      through: models.EvenementUser, 
      foreignKey: 'id_user' 
    });
    
    User.belongsToMany(models.Programme, { 
      through: models.ProgrammeIntervenant, 
      foreignKey: 'id_user' 
    });
    
    // Relations en tant que créateur/validateur
    User.hasMany(models.Oeuvre, { as: 'OeuvresSaisies', foreignKey: 'saisi_par' });
    User.hasMany(models.Oeuvre, { as: 'OeuvresValidees', foreignKey: 'validateur_id' });
    User.hasMany(models.Evenement, { foreignKey: 'id_user' });
    User.hasMany(models.Commentaire, { foreignKey: 'id_user' });
    User.hasMany(models.CritiqueEvaluation, { foreignKey: 'id_user' });
    
    // Relations de validation
    User.hasMany(models.User, { as: 'ProfessionnelsValides', foreignKey: 'validateur_professionnel_id' });
    User.belongsTo(models.User, { as: 'ValidateurProfessionnel', foreignKey: 'validateur_professionnel_id' });
  };

  return User;
};