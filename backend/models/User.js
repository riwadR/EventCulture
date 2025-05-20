const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    prenom: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    date_naissance: {
      type: DataTypes.DATEONLY
    },
    nationalite: {
      type: DataTypes.STRING(50)
    },
    biographie: {
      type: DataTypes.TEXT
    },
    photo_url: {
      type: DataTypes.STRING(255)
    }
  }, {
    tableName: 'User',
    createdAt: 'date_creation',
    updatedAt: 'date_modification'
  });

  User.associate = models => {
    User.belongsToMany(models.Role, { through: models.UserRole, foreignKey: 'id_user' });
    User.belongsToMany(models.Evenement, {
      through: models.EvenementUser,
      foreignKey: 'id_user',
      as: 'EvenementsParticipes'
    });
    User.hasMany(models.EvenementUser, { foreignKey: 'id_user' });
    User.hasMany(models.EvenementOeuvre, { foreignKey: 'id_user' });
  };

  return User;
};
