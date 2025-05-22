const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Daira = sequelize.define('Daira', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    wilayaId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'dairas',
    timestamps: true,
  });

  Daira.associate = (models) => {
    Daira.belongsTo(models.Wilaya, { foreignKey: 'wilayaId' });
    Daira.hasMany(models.Commune, { foreignKey: 'dairaId', onDelete: 'CASCADE' });
  };

  return Daira;
};