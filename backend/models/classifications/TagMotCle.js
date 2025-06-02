const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TagMotCle = sequelize.define('TagMotCle', {
    id_tag: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'tagmotcle',
    timestamps: false
  });

  // Associations
  TagMotCle.associate = (models) => {
    TagMotCle.belongsToMany(models.Oeuvre, { 
      through: models.OeuvreTag, 
      foreignKey: 'id_tag' 
    });
  };

  return TagMotCle;
};