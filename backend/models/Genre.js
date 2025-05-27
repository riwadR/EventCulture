// models/Genre.js
module.exports = (sequelize, DataTypes) => {
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

  Genre.associate = function(models) {
    Genre.hasMany(models.AlbumMusical, { foreignKey: 'id_genre' });
  };

  return Genre;
};
