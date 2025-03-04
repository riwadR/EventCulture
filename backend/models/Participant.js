const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Event = require("./Event");

const Participant = sequelize.define("Participant", {
  id_participant: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Référence la table User
      key: "id_user",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
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
  statut: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date_inscription: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Date de l'inscription
  },
});

module.exports = Participant;
