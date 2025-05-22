const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Wilaya = sequelize.define('Wilaya', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'wilayas',
    timestamps: true,
  });

  Wilaya.associate = (models) => {
    Wilaya.hasMany(models.Daira, { foreignKey: 'wilayaId', onDelete: 'CASCADE' });
  };

  return Wilaya;
};