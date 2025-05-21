module.exports = (sequelize, DataTypes) => {
  const TagMotCle = sequelize.define('TagMotCle', {
    id_tag: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'TagMotCle',
    timestamps: false
  });

  TagMotCle.associate = function(models) {
    TagMotCle.belongsToMany(models.Oeuvre, {
      through: 'Oeuvre_Tag',
      foreignKey: 'id_tag',
      otherKey: 'id_oeuvre'
    });
  };

  return TagMotCle;
};
