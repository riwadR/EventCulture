const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
// Modèle EvenementOrganisation (organisations impliquées dans un événement)
module.exports = (sequelize, DataTypes) => {
  const EvenementOrganisation = sequelize.define('EvenementOrganisation', {
    id_evenement: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Evenement',
        key: 'id_evenement'
      }
    },
    id_organisation: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Organisation',
        key: 'id_organisation'
      }
    },
    role: {
      type: DataTypes.STRING(100), // Exemple : 'organisateur', 'partenaire', 'sponsor'
      allowNull: true
    }
  }, {
    tableName: 'EvenementOrganisation',
    timestamps: false
  });

  EvenementOrganisation.associate = (models) => {
    EvenementOrganisation.belongsTo(models.Evenement, {
      foreignKey: 'id_evenement',
      onDelete: 'CASCADE'
    });
    EvenementOrganisation.belongsTo(models.Organisation, {
      foreignKey: 'id_organisation',
      onDelete: 'CASCADE'
    });
  };

  return EvenementOrganisation;
};
