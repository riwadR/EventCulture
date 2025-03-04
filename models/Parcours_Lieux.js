// models/ParcoursLieux.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Parcours = require("./Parcours");
const Lieu = require("./Lieu");
const Event = require("./Event");

const ParcoursLieux = sequelize.define("ParcoursLieux", {
  id_parcours_lieu: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  id_parcours: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Parcours, // Référence la table Parcours
      key: "id_parcours",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  id_lieu: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Lieu, // Référence la table Lieu
      key: "id_lieu",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  id_evenement: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Event, // Référence la table Event
      key: "id_event",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  ordre: {
    type: DataTypes.INTEGER,
    allowNull: true, // Peut être nul
  },
});

module.exports = ParcoursLieux;
