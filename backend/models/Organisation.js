// models/Organisation.js
module.exports = (sequelize, DataTypes) => {
const Organisation = sequelize.define('Organisation', {
  id_organisation: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  site_web: {
    type: DataTypes.STRING(255)
  }
}, {
  tableName: 'Organisation',
  timestamps: false
});

 Organisation.associate = (models) => {
    Organisation.hasMany(models.EvenementOrganisation, {
      foreignKey: 'id_organisation',
      as: 'evenements',
    });
  };

return Organisation; }
