const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  const Lieu = sequelize.define('Lieu', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    adresse: { type: DataTypes.STRING, allowNull: false },
    commune_id: { type: DataTypes.INTEGER, allowNull: false }
  }, { tableName: 'lieu', timestamps: false });

  Lieu.associate = (models) => {
    Lieu.belongsTo(models.Commune, { foreignKey: 'commune_id' });
  };

  return Lieu;
};
module.exports = Lieu;