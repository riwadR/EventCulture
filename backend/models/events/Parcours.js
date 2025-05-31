const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Parcours = sequelize.define('Parcours', {
    id_parcours: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'parcours',
    timestamps: true
  });

  // Associations
  Parcours.associate = (models) => {
    Parcours.belongsToMany(models.Lieu, { 
      through: models.ParcoursLieu, 
      foreignKey: 'id_parcours' 
    });
  };

  return Parcours;
};