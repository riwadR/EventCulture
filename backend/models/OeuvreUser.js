// models/OeuvreUser.js
module.exports = (sequelize, DataTypes) => {
const OeuvreUser = sequelize.define('OeuvreUser', {

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
  id_user: {
    type: DataTypes.INTEGER,
    
    references: {
      model: 'User',
      key: 'id_user'
    }
  },
  role: {
    type: DataTypes.STRING(100), // rôle de l'utilisateur dans l'oeuvre (ex: auteur, réalisateur...)
    allowNull: false
  }
}, 
{
  indexes: [
    {
      unique: true,
      fields: ['id_user', 'id_oeuvre']
    }
  ]
},
{
  tableName: 'Oeuvre_User',
  timestamps: false
});

OeuvreUser.associate = models => {
  OeuvreUser.belongsTo(models.Oeuvre, { foreignKey: 'id_oeuvre' });
  OeuvreUser.belongsTo(models.User, { foreignKey: 'id_user' });
};

return OeuvreUser; }
