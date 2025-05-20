const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
module.exports = (sequelize, DataTypes) => {
  const EvenementCategorie = sequelize.define('EvenementCategorie', {
    id_evenement: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Evenement',
        key: 'id_evenement'
      }
    },
    id_categorie: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Categorie',
        key: 'id_categorie'
      }
    }
  }, {
    tableName: 'EvenementCategorie',
    timestamps: false
  });

  EvenementCategorie.associate = (models) => {
    EvenementCategorie.belongsTo(models.Evenement, {
      foreignKey: 'id_evenement',
      onDelete: 'CASCADE'
    });
    EvenementCategorie.belongsTo(models.Categorie, {
      foreignKey: 'id_categorie',
      onDelete: 'CASCADE'
    });
  };

  return EvenementCategorie;
};
