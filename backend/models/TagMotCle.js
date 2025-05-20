module.exports = (sequelize, DataTypes) => {
const TagMotCle = sequelize.define('TagMotCle', {
    id_tag: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    mot_cle: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(50)
    }
  }, {
    tableName: 'Tag_Mot_Cle',
    timestamps: false
  });

 

return TagMotCle; }
