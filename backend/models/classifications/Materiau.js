const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Materiau = sequelize.define('Materiau', {
    id_materiau: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'materiau',
    timestamps: false
  });

  // Associations
  Materiau.associate = (models) => {
    Materiau.hasMany(models.Artisanat, { foreignKey: 'id_materiau' });
  };

  return Materiau;
};