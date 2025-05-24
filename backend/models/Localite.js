// models/Localite.js
module.exports = (sequelize, DataTypes) => {
  const Localite = sequelize.define('Localite', {
    id_localite: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    localite_name_ascii: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_commune: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'communes',
        key: 'id_commune',
      },
      onDelete: 'CASCADE',
    },
  }, {
    tableName: 'Localite',
    timestamps: false,
  });

  Localite.associate = (models) => {
    Localite.belongsTo(models.Commune, {
      foreignKey: 'id_commune',
      onDelete: 'CASCADE',
    });
  };

  return Localite;
};
