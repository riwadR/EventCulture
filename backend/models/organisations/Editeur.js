const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Editeur = sequelize.define('Editeur', {
    id_editeur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    type_editeur: {
      type: DataTypes.ENUM('maison_edition', 'label_musique', 'studio_cinema', 'galerie_art', 'editeur_scientifique', 'presse', 'editeur_numerique', 'autre'),
      allowNull: false
    },
    pays: {
      type: DataTypes.STRING(100)
    },
    ville: {
      type: DataTypes.STRING(100)
    },
    adresse: {
      type: DataTypes.TEXT
    },
    site_web: {
      type: DataTypes.STRING(255)
    },
    email: {
      type: DataTypes.STRING(255)
    },
    telephone: {
      type: DataTypes.STRING(20)
    },
    description: {
      type: DataTypes.TEXT
    },
    annee_creation: {
      type: DataTypes.INTEGER
    },
    actif: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'editeur',
    timestamps: true,
    createdAt: 'date_creation',
    updatedAt: 'date_modification'
  });

  // Associations
  Editeur.associate = (models) => {
    Editeur.belongsToMany(models.Oeuvre, { 
      through: models.OeuvreEditeur, 
      foreignKey: 'id_editeur' 
    });
  };

  return Editeur;
};