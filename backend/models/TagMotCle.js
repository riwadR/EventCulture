const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
// Modèle TagMotCle
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