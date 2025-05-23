module.exports = (sequelize, DataTypes) => {
  const LieuMedia = sequelize.define('LieuMedia', {
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
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'lieu_medias',
    timestamps: true,
  });

  LieuMedia.associate = (models) => {
    LieuMedia.belongsTo(models.Lieu, { foreignKey: 'id_lieu' });
  };

  return LieuMedia;
};