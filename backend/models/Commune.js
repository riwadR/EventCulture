const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Commune = sequelize.define('Commune', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dairaId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'communes',
    timestamps: true,
  });

  Commune.associate = (models) => {
    Commune.belongsTo(models.Daira, { foreignKey: 'dairaId' });
  };

  return Commune;
};