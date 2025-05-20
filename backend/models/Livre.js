const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Modèle Livre
module.exports = (sequelize, DataTypes) => {
  const Livre = sequelize.define('Livre', {
    id_livre: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_oeuvre: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isbn: {
      type: DataTypes.STRING(20)
    },
    nb_pages: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'Livre',
    timestamps: false
  });

  Livre.associate = models => {
    Livre.belongsTo(models.Oeuvre, { foreignKey: 'id_oeuvre' });
  };

  return Livre;
};