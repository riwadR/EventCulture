const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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
        model: 'typeorganisation',
        key: 'id_type_organisation'
      }
    },
    description: {
      type: DataTypes.TEXT
    },
    site_web: {
      type: DataTypes.STRING(255)
    }
  }, {
    tableName: 'organisation',
    timestamps: false
  });

  // Associations
  Organisation.associate = (models) => {
    Organisation.belongsTo(models.TypeOrganisation, { foreignKey: 'id_type_organisation' });
    Organisation.belongsToMany(models.Evenement, { 
      through: models.EvenementOrganisation, 
      foreignKey: 'id_organisation' 
    });
  };

  return Organisation;
};