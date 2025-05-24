module.exports = (sequelize, DataTypes) => {
  const Daira = sequelize.define('Daira', {
    id_daira: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    daira_name_ascii: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    wilayaId: {
      type: DataTypes.INTEGER,
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
