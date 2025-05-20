const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
// Modèle Categorie
module.exports = (sequelize, DataTypes) => {
  const Categorie = sequelize.define('Categorie', {
    id_categorie: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'Categorie',
    timestamps: false
  });

  Categorie.associate = (models) => {
    Categorie.belongsToMany(models.Evenement, {
      through: models.EvenementCategorie,
      foreignKey: 'id_categorie',
      otherKey: 'id_evenement'
    });
  };

  return Categorie;
};
