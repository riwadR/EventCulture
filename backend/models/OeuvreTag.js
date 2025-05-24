// models/OeuvreTag.js
module.exports = (sequelize, DataTypes) => {
const OeuvreTag = sequelize.define('OeuvreTag', {
  id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
  id_oeuvre: {
    type: DataTypes.INTEGER,
  
    references: {
      model: 'Oeuvre',
      key: 'id_oeuvre'
    }
  },
  id_tag: {
    type: DataTypes.INTEGER,
  
    references: {
      model: 'TagMotCle',
      key: 'id_tag'
    }
  }
},
{
  indexes: [
    {
      unique: true,
      fields: ['id_tag', 'id_oeuvre']
    }
  ]
},

{
  tableName: 'Oeuvre_Tag',
  timestamps: false
});

OeuvreTag.associate = models => {
  OeuvreTag.belongsTo(models.Oeuvre, { foreignKey: 'id_oeuvre' });
  OeuvreTag.belongsTo(models.TagMotCle, { foreignKey: 'id_tag' });
};

return OeuvreTag; }
