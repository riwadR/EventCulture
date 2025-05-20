module.exports = (sequelize, DataTypes) => {
  const Lieu = sequelize.define('Lieu', {
    id_lieu: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    adresse: {
      type: DataTypes.STRING,
      allowNull: false
    },
    commune_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'commune',
        key: 'id_commune'      // Clé primaire exacte dans commune
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    }
  }, {
    tableName: 'lieu',
    timestamps: false
  });

  Lieu.associate = (models) => {
    Lieu.belongsTo(models.Commune, { foreignKey: 'commune_id' });
  };

  return Lieu;
};
