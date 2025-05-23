module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_lieu: {
        type: DataTypes.INTEGER,   // INTEGER et FK vers Lieu.id_lieu
        allowNull: false,
        references: {
          model: "lieux",  // Nom de la table Lieu (pluriel)
          key: "id_lieu",
        },
        onDelete: "RESTRICT",
      },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'services',
    timestamps: true,
  });

  Service.associate = (models) => {
    Service.belongsTo(models.Lieu, { foreignKey: 'id_lieu' });
  };

  return Service;
};