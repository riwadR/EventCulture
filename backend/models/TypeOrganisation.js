module.exports = (sequelize, DataTypes) => {
  const TypeOrganisation = sequelize.define('TypeOrganisation', {
    id_type_organisation: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'TypeOrganisation',
    timestamps: false,
  });

  TypeOrganisation.associate = models => {
    TypeOrganisation.hasMany(models.Organisation, {
      foreignKey: 'id_type_organisation',
      as: 'organisations',
    });
  };

  return TypeOrganisation;
};
