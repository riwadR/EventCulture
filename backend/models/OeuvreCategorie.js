// models/OeuvreCategorie.js
const { DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {

const OeuvreCategorie = sequelize.define('OeuvreCategorie', {
  id_oeuvre: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Oeuvre',
      key: 'id_oeuvre'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  id_categorie: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Categorie',
      key: 'id_categorie'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
}, {
  tableName: 'OeuvreCategorie',
  timestamps: false
});

OeuvreCategorie.associate = models => {
  OeuvreCategorie.belongsTo(models.Oeuvre, { foreignKey: 'id_oeuvre' });
  OeuvreCategorie.belongsTo(models.Categorie, { foreignKey: 'id_categorie' });
};

return OeuvreCategorie; }
