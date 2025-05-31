const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Genre = sequelize.define('Genre', {
    id_genre: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'genre',
    timestamps: false
  });

  // Associations
  Genre.associate = (models) => {
    Genre.hasMany(models.Livre, { foreignKey: 'id_genre' });
    Genre.hasMany(models.Film, { foreignKey: 'id_genre' });
    Genre.hasMany(models.AlbumMusical, { foreignKey: 'id_genre' });
  };

  return Genre;
};