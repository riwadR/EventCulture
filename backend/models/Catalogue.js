const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); 
const Event = require("./Event"); // Import du modèle Event

const Catalogue = sequelize.define("Catalogue", {
  id_catalog: {
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
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
        notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true, // Peut être vide
  },
});

module.exports = Catalogue;