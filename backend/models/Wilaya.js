module.exports = (sequelize, DataTypes) => {
  const Wilaya = sequelize.define('Wilaya', {
    id_wilaya: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    codeW: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    wilaya_name_ascii: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'wilayas',
    timestamps: true,
  });

  Wilaya.associate = (models) => {
    Wilaya.hasMany(models.Daira, { foreignKey: 'wilayaId', onDelete: 'CASCADE' });
  };

  return Wilaya;
};
