const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
    const Commune = sequelize.define('Commune', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nom: { type: DataTypes.STRING, allowNull: false },
      daira_id: { type: DataTypes.INTEGER, allowNull: false }
    }, { tableName: 'commune', timestamps: false });
  
    Commune.associate = (models) => {
      Commune.belongsTo(models.Daira, { foreignKey: 'daira_id' });
      Commune.hasMany(models.Lieu, { foreignKey: 'commune_id' });
    };
  
    return Commune;
  };
  module.exports = Commune;