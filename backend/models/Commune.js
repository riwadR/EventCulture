module.exports = (sequelize, DataTypes) => {
  const Commune = sequelize.define('Commune', {
    id_commune: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    commune_name_ascii: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dairaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'communes',
    timestamps: true,
  });

  Commune.associate = (models) => {
    Commune.belongsTo(models.Daira, { foreignKey: 'dairaId' });
  };

  return Commune;
};
