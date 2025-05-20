const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_role: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    }
  }, {
    tableName: 'User_Role',
    timestamps: false
  });

  return UserRole;
};