
module.exports = (sequelize, DataTypes) => {
const AlbumMusical = sequelize.define('AlbumMusical', {
  id_album: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_oeuvre: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_genre: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  duree: {
    type: DataTypes.INTEGER // durée en minutes
  }
}, {
  tableName: 'albummusical',
  timestamps: false
});

AlbumMusical.associate = function(models) {
  AlbumMusical.belongsTo(models.Oeuvre, { foreignKey: 'id_oeuvre' });
   AlbumMusical.belongsTo(models.Genre, { foreignKey: 'id_genre' });
};

return AlbumMusical;}
