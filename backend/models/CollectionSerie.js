const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
// Modèle CollectionSerie
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
  tableName: 'Collection_Serie',
  timestamps: false
});

export default CollectionSerie;