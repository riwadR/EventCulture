const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Modèle Film
module.exports = (sequelize, DataTypes) => {
  const Film = sequelize.define('Film', {
    id_film: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_oeuvre: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    duree_minutes: {
      type: DataTypes.INTEGER
    },
    realisateur: {
      type: DataTypes.STRING(255)
    }
  }, {
    tableName: 'Film',
    timestamps: false
  });

  Film.associate = models => {
    Film.belongsTo(models.Oeuvre, { foreignKey: 'id_oeuvre' });
  };

  return Film;
};