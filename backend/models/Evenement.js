const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
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
    id_lieu: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Evenement',
    timestamps: false
  });

  Evenement.associate = models => {
    Evenement.belongsTo(models.Lieu, { foreignKey: 'id_lieu' });
    Evenement.belongsToMany(models.User, {
      through: models.EvenementUser,
      foreignKey: 'id_evenement',
      otherKey: 'id_user',
      as: 'Participants'
    });
    Evenement.belongsToMany(models.Oeuvre, {
      through: models.EvenementOeuvre,
      foreignKey: 'id_evenement',
      as: 'OeuvresPresentation'
    });
    Evenement.hasMany(models.EvenementUser, { foreignKey: 'id_evenement' });
    Evenement.hasMany(models.EvenementOeuvre, { foreignKey: 'id_evenement' });
  };

  return Evenement;
};