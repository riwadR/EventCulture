const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TypeOeuvre = sequelize.define('TypeOeuvre', {
    id_type_oeuvre: {
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
    tableName: 'type_oeuvre',
    timestamps: false
  });

  // Associations
  TypeOeuvre.associate = (models) => {
    TypeOeuvre.hasMany(models.Oeuvre, { foreignKey: 'id_type_oeuvre' });
  };

  return TypeOeuvre;
};