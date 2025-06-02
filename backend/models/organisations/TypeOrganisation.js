const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TypeOrganisation = sequelize.define('TypeOrganisation', {
    id_type_organisation: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'typeorganisation',
    timestamps: false
  });

  // Associations
  TypeOrganisation.associate = (models) => {
    TypeOrganisation.hasMany(models.Organisation, { foreignKey: 'id_type_organisation' });
  };

  return TypeOrganisation;
};
