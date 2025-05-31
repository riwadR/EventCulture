const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProgrammeIntervenant = sequelize.define('ProgrammeIntervenant', {
    id_programme: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'programme',
        key: 'id_programme'
      }
    },
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'id_user'
      }
    }
  }, {
    tableName: 'programmeintervenant',
    timestamps: true
  });

  // Associations
  ProgrammeIntervenant.associate = (models) => {
    ProgrammeIntervenant.belongsTo(models.Programme, { foreignKey: 'id_programme' });
    ProgrammeIntervenant.belongsTo(models.User, { foreignKey: 'id_user' });
  };

  return ProgrammeIntervenant;
};