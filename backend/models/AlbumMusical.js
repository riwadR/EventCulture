const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Modèle AlbumMusical
module.exports = (sequelize, DataTypes) => {
  const AlbumMusical = sequelize.define('AlbumMusical', {
    id_album: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_oeuvre: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    genre: {
      type: DataTypes.STRING(100)
    },
    duree: {
      type: DataTypes.INTEGER // durée en minutes
    }
  }, {
    tableName: 'AlbumMusical',
    timestamps: false
  });

  AlbumMusical.associate = models => {
    AlbumMusical.belongsTo(models.Oeuvre, { foreignKey: 'id_oeuvre' });
  };

  return AlbumMusical;
};
