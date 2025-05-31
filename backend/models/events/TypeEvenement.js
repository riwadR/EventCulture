const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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
    tableName: 'type_evenement',
    timestamps: false
  });

  // Associations
  TypeEvenement.associate = (models) => {
    TypeEvenement.hasMany(models.Evenement, { foreignKey: 'id_type_evenement' });
  };

  return TypeEvenement;
};
