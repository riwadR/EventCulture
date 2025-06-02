const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Langue = sequelize.define('Langue', {
    id_langue: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    code: {
      type: DataTypes.STRING(10)
    }
  }, {
    tableName: 'langue',
    timestamps: false
  });

  // Associations
  Langue.associate = (models) => {
    Langue.hasMany(models.Oeuvre, { foreignKey: 'id_langue' });
  };

  return Langue;
};