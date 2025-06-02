const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Technique = sequelize.define('Technique', {
    id_technique: {
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
    tableName: 'technique',
    timestamps: false
  });

  // Associations
  Technique.associate = (models) => {
    Technique.hasMany(models.Artisanat, { foreignKey: 'id_technique' });
  };

  return Technique;
};