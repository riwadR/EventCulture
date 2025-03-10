// models/Media.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Event = require("./Event");
const Programme = require("./Programme");
const Catalogue = require("./Catalogue");

const Media = sequelize.define("Media", {
  id_media: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  id_event: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Event, // Référence la table Event
      key: "id_event",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  id_programme: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Programme, // Référence la table Programme
      key: "id_programme",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  id_catalog: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Catalogue, // Référence la table Catalogue
      key: "id_catalog",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  type_media: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url_media: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Media;
