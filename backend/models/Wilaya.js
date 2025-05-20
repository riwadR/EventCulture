const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
module.exports = (sequelize, DataTypes) => {
    const Wilaya = sequelize.define('Wilaya', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nom: { type: DataTypes.STRING, allowNull: false }
    }, { tableName: 'wilaya', timestamps: false });
  
    Wilaya.associate = (models) => {
      Wilaya.hasMany(models.Daira, { foreignKey: 'wilaya_id' });
    };
  
    return Wilaya;
  };