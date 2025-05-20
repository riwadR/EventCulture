// models/Parcours.js
module.exports = (sequelize, DataTypes) => {
const Parcours = sequelize.define("Parcours", {
  id_parcours: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true, // Peut être vide
  },
});

return Parcours; }
