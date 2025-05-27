// models/OeuvreCategorie.js
module.exports = (sequelize, DataTypes) => {

const OeuvreCategorie = sequelize.define('OeuvreCategorie', {
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
  id_categorie: {
    type: DataTypes.INTEGER,
   
    references: {
      model: 'Categorie',
      key: 'id_categorie'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
}, 
{
  indexes: [
    {
      unique: true,
      fields: ['id_oeuvre', 'id_categorie']
    }
  ]
},
{
  tableName: 'OeuvreCategorie',
  timestamps: false
});

OeuvreCategorie.associate = models => {
  OeuvreCategorie.belongsTo(models.Oeuvre, { foreignKey: 'id_oeuvre' });
  OeuvreCategorie.belongsTo(models.Categorie, { foreignKey: 'id_categorie' });
};

return OeuvreCategorie; }
