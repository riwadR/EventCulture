
// Modèle OeuvreArt
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
module.exports = (sequelize, DataTypes) => {
  const OeuvreArt = sequelize.define('OeuvreArt', {
    id_oeuvre_art: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_oeuvre: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    technique: {
      type: DataTypes.STRING(255)
    }
  }, {
    tableName: 'OeuvreArt',
    timestamps: false
  });

  OeuvreArt.associate = models => {
    OeuvreArt.belongsTo(models.Oeuvre, { foreignKey: 'id_oeuvre' });
  };

  return OeuvreArt;
};
