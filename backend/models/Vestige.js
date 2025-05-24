const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Vestige = sequelize.define('Vestige', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    detailLieuId: {
      type: DataTypes.INTEGER, // Changed from VARCHAR(255) to INTEGER
      allowNull: false,
    },
    nom: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('Ruines', 'Murailles', 'Site archéologique'),
      allowNull: false,
    },
  }, {
    tableName: 'vestiges',
    timestamps: true, // createdAt and updatedAt are managed by Sequelize
  });

  Vestige.associate = (models) => {
    Vestige.belongsTo(models.DetailLieu, {
      foreignKey: 'detailLieuId',
      targetKey: 'id_detailLieu',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Vestige;
};