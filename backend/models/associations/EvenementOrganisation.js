const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EvenementOrganisation = sequelize.define('EvenementOrganisation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_evenement: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'evenement',
        key: 'id_evenement'
      }
    },
    id_organisation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'organisation',
        key: 'id_organisation'
      }
    },
    role: {
      type: DataTypes.STRING(100)
    }
  }, {
    tableName: 'evenementorganisation',
    timestamps: true,
    createdAt: 'date_creation',
    updatedAt: 'date_modification',
    indexes: [
      {
        unique: true,
        fields: ['id_organisation', 'id_evenement']
      }
    ]
  });

  // Associations
  EvenementOrganisation.associate = (models) => {
    EvenementOrganisation.belongsTo(models.Evenement, { foreignKey: 'id_evenement' });
    EvenementOrganisation.belongsTo(models.Organisation, { foreignKey: 'id_organisation' });
  };

  return EvenementOrganisation;
};
