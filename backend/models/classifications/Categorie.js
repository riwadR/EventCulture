const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Categorie = sequelize.define('Categorie', {
    id_categorie: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'categorie',
    timestamps: false
  });

  // Associations
  Categorie.associate = (models) => {
    Categorie.belongsToMany(models.Oeuvre, { 
      through: models.OeuvreCategorie, 
      foreignKey: 'id_categorie' 
    });
  };

  return Categorie;
};