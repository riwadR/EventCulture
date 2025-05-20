const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
module.exports = (sequelize, DataTypes) => {
  const TypeEvenement = sequelize.define('TypeEvenement', {
    id_type_evenement: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'Type_Evenement',
    timestamps: false
  });

  TypeEvenement.associate = models => {
    TypeEvenement.hasMany(models.Evenement, { foreignKey: 'id_type_evenement' });
  };

  return TypeEvenement;
};
