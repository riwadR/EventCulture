module.exports = (sequelize, DataTypes) => {
  const Lieu = sequelize.define('Lieu', {
    id_lieu: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    typeLieu: {
      type: DataTypes.ENUM('Wilaya', 'Daira', 'Commune'),
      allowNull: false,
    },
    wilayaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dairaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    communeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    localiteId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adresse: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    tableName: 'lieux',
    timestamps: true,
    validate: {
      exactlyOneLocation() {
        const locations = [this.wilayaId, this.dairaId, this.communeId];
        const definedLocations = locations.filter(id => id !== null && id !== undefined);
        if (definedLocations.length !== 1) {
          throw new Error('Exactly one of wilayaId, dairaId, or communeId must be defined');
        }
        if (this.typeLieu === 'Wilaya' && (this.wilayaId === null || this.wilayaId === undefined)) {
          throw new Error('wilayaId must be defined for typeLieu "Wilaya"');
        }
        if (this.typeLieu === 'Daira' && (this.dairaId === null || this.dairaId === undefined)) {
          throw new Error('dairaId must be defined for typeLieu "Daira"');
        }
        if (this.typeLieu === 'Commune' && (this.communeId === null || this.communeId === undefined)) {
          throw new Error('communeId must be defined for typeLieu "Commune"');
        }
      },
    },
  });

  Lieu.associate = (models) => {
    Lieu.belongsTo(models.Wilaya, { foreignKey: 'wilayaId' });
    Lieu.belongsTo(models.Localite, { foreignKey: 'localiteId' });
    Lieu.belongsTo(models.Daira, { foreignKey: 'dairaId' });
    Lieu.belongsTo(models.Commune, { foreignKey: 'communeId' });
    Lieu.hasOne(models.DetailLieu, { foreignKey: 'lieuId', onDelete: 'CASCADE' });
    Lieu.hasMany(models.LieuMedia, { foreignKey: 'lieuId', onDelete: 'CASCADE' });
    Lieu.hasMany(models.Service, { foreignKey: 'lieuId', onDelete: 'CASCADE' });
  };

  return Lieu;
};
