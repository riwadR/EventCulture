module.exports = (sequelize, DataTypes) => {
const CollectionSerie = sequelize.define('CollectionSerie', {
  id_collection: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  type: {
    type: DataTypes.STRING(50)
  }
}, {
  tableName: 'collection_serie',
  timestamps: false
});

// Si besoin d’associations, ajouter ici
CollectionSerie.associate = function(models) {
  // Exemple : CollectionSerie.hasMany(models.SomeModel, { foreignKey: 'id_collection_serie' });
};

return CollectionSerie; }
