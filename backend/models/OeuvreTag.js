// models/OeuvreTag.js
module.exports = (sequelize, DataTypes) => {
const OeuvreTag = sequelize.define('OeuvreTag', {
  id_oeuvre: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Oeuvre',
      key: 'id_oeuvre'
    }
  },
  id_tag: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'TagMotCle',
      key: 'id_tag'
    }
  }
}, {
  tableName: 'Oeuvre_Tag',
  timestamps: false
});

OeuvreTag.associate = models => {
  OeuvreTag.belongsTo(models.Oeuvre, { foreignKey: 'id_oeuvre' });
  OeuvreTag.belongsTo(models.TagMotCle, { foreignKey: 'id_tag' });
};

return OeuvreTag; }
