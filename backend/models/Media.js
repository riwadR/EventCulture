// models/Media.js
module.exports = (sequelize, DataTypes) => {

const Media = sequelize.define('Media', {
  id_media: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_oeuvre: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type_media: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  url: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Media',
  timestamps: false
});

// Associations, à configurer dans models/index.js ou après l'import de tous les modèles
Media.associate = (models) => {
  Media.belongsTo(models.Oeuvre, { foreignKey: 'id_oeuvre' });
};

return Media; }
