const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
module.exports = (sequelize, DataTypes) => {
    const Daira = sequelize.define('Daira', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nom: { type: DataTypes.STRING, allowNull: false },
      wilaya_id: { type: DataTypes.INTEGER, allowNull: false }
    }, { tableName: 'daira', timestamps: false });
  
    Daira.associate = (models) => {
      Daira.belongsTo(models.Wilaya, { foreignKey: 'wilaya_id' });
      Daira.hasMany(models.Commune, { foreignKey: 'daira_id' });
    };
  
    return Daira;
  };
 