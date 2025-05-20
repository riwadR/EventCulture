// models/Media.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Event = require("./Event");
const Programme = require("./Programme");
const Catalogue = require("./Catalogue");
module.exports = (sequelize, DataTypes) => {
  const Media = sequelize.define('Media', {
    id_media: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_oeuvre: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type_media: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'Media',
    timestamps: false
  });

  Media.associate = models => {
    Media.belongsTo(models.Oeuvre, { foreignKey: 'id_oeuvre' });
  };

  return Media;
};
