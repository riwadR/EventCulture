const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserOrganisation = sequelize.define('UserOrganisation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id_user'
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
    role_dans_organisation: {
      type: DataTypes.ENUM('membre', 'responsable', 'directeur', 'collaborateur'),
      defaultValue: 'membre'
    },
    date_debut: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    date_fin: {
      type: DataTypes.DATE
    },
    actif: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'user_organisation',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['id_user', 'id_organisation']
      }
    ]
  });

  // Associations
  UserOrganisation.associate = (models) => {
    UserOrganisation.belongsTo(models.User, { foreignKey: 'id_user' });
    UserOrganisation.belongsTo(models.Organisation, { foreignKey: 'id_organisation' });
  };

  return UserOrganisation;
};