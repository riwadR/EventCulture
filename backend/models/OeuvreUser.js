const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  const OeuvreUser = sequelize.define('OeuvreUser', {
    id_oeuvre: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Oeuvre',
        key: 'id_oeuvre'
      }
    },
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'id_user'
      }
    },
    role: {
      type: DataTypes.STRING(100), // rôle de l'utilisateur dans l'oeuvre (ex: auteur, réalisateur...)
      allowNull: false
    }
  }, {
    tableName: 'Oeuvre_User',
    timestamps: false
  });

  OeuvreUser.associate = (models) => {
    OeuvreUser.belongsTo(models.Oeuvre, { foreignKey: 'id_oeuvre' });
    OeuvreUser.belongsTo(models.User, { foreignKey: 'id_user' });
  };

  return OeuvreUser;
};
