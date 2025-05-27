const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Monument = sequelize.define('Monument', {
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
      type: DataTypes.ENUM('Mosquée', 'Palais', 'Statue', 'Tour', 'Musée'),
      allowNull: false,
    },
  }, {
    tableName: 'monuments',
    timestamps: true, // createdAt and updatedAt are managed by Sequelize
  });

  Monument.associate = (models) => {
    Monument.belongsTo(models.DetailLieu, {
      foreignKey: 'detailLieuId',
      targetKey: 'id_detailLieu',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Monument;
};