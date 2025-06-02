const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Evenement = sequelize.define('Evenement', {
    id_evenement: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom_evenement: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    date_debut: {
      type: DataTypes.DATE
    },
    date_fin: {
      type: DataTypes.DATE
    },
    contact_email: {
      type: DataTypes.STRING(255)
    },
    contact_telephone: {
      type: DataTypes.STRING(20)
    },
    image_url: {
      type: DataTypes.STRING(255)
    },
    id_lieu: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'lieux',
        key: 'id_lieu'
      }
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id_user'
      }
    },
    id_type_evenement: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'type_evenement',
        key: 'id_type_evenement'
      }
    }
  }, {
    tableName: 'evenement',
    timestamps: true,
    createdAt: 'date_creation',
    updatedAt: 'date_modification'
  });

  // Associations
  Evenement.associate = (models) => {
    Evenement.belongsTo(models.TypeEvenement, { foreignKey: 'id_type_evenement' });
    Evenement.belongsTo(models.Lieu, { foreignKey: 'id_lieu' });
    Evenement.belongsTo(models.User, { foreignKey: 'id_user' });
    
    Evenement.hasMany(models.Programme, { foreignKey: 'id_evenement' });
    Evenement.hasMany(models.Media, { foreignKey: 'id_evenement' });
    
    Evenement.belongsToMany(models.Oeuvre, { 
      through: models.EvenementOeuvre, 
      foreignKey: 'id_evenement' 
    });
    Evenement.belongsToMany(models.User, { 
      through: models.EvenementUser, 
      foreignKey: 'id_evenement' 
    });
    Evenement.belongsToMany(models.Organisation, { 
      through: models.EvenementOrganisation, 
      foreignKey: 'id_evenement' 
    });
  };

  return Evenement;
};