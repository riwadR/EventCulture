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
   id_type_organisation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "TypeOrganisation",
        key: "id_type_organisation",
      },
      onDelete: "RESTRICT",
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
    Organisation.belongsTo(models.TypeOrganisation, {
      foreignKey: 'id_type_organisation',
      as: 'typeOrganisation',
    });
  };

return Organisation; }
