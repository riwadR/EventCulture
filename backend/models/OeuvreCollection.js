const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Modèle OeuvreCollection
module.exports = (sequelize, DataTypes) => {
  const OeuvreCollection = sequelize.define('OeuvreCollection', {
    id_oeuvre: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Oeuvre',
        key: 'id_oeuvre'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    id_collection: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Collection',
        key: 'id_collection'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  }, {
    tableName: 'OeuvreCollection',
    timestamps: false
  });

  OeuvreCollection.associate = (models) => {
    OeuvreCollection.belongsTo(models.Oeuvre, { foreignKey: 'id_oeuvre' });
    OeuvreCollection.belongsTo(models.Collection, { foreignKey: 'id_collection' });
  };

  return OeuvreCollection;
};
