const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Modèle OeuvrePersonne
const OeuvreUser = sequelize.define('OeuvrePersonne', {
  id_oeuvre: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  id_role: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  details: {
    type: DataTypes.STRING(255)
  }
}, {
  tableName: 'Oeuvre_User',
  timestamps: false
});

export default  OeuvreUser ;