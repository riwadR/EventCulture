const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Event = require("./Event");

const Commentaire = sequelize.define("Commentaire", {
  id_comment: {
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
  commentaire: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date_commentaire: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Date du commentaire
  },
});

module.exports = Commentaire;
