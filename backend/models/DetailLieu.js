module.exports = (sequelize, DataTypes) => {
  const DetailLieu = sequelize.define('DetailLieu', {
    
    
    id_detailLieu: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
},
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    horaires: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    histoire: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    
    referencesHistoriques: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    noteMoyenne: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  }, {
    tableName: 'detail_lieux',
    timestamps: true,
  });

  DetailLieu.associate = (models) => {
    DetailLieu.belongsTo(models.Lieu, { foreignKey: 'id_lieu' });
DetailLieu.hasMany(models.Monument, {
      foreignKey: 'detailLieuId',
      sourceKey: 'id_detailLieu',
      as: 'monuments',
    });
    DetailLieu.hasMany(models.Vestige, { foreignKey: 'detailLieuId', onDelete: 'CASCADE' });
  };

  return DetailLieu;
};