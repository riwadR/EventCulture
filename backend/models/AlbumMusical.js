
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
  genre: {
    type: DataTypes.STRING(100)
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
};

return AlbumMusical;}
