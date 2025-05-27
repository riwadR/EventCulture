// models/OeuvreCollection.js

module.exports = (sequelize, DataTypes) => {

const OeuvreCollection = sequelize.define('OeuvreCollection', {
  
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
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  id_collection: {
    type: DataTypes.INTEGER,
   
    references: {
      model: 'Collection',
      key: 'id_collection'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
},
{
  indexes: [
    {
      unique: true,
      fields: ['id_oeuvre', 'id_collection']
    }
  ]
},

{
  tableName: 'OeuvreCollection',
  timestamps: false
});

OeuvreCollection.associate = models => {
  OeuvreCollection.belongsTo(models.Oeuvre, { foreignKey: 'id_oeuvre' });
  OeuvreCollection.belongsTo(models.Collection, { foreignKey: 'id_collection' });
};

return OeuvreCollection; }
