const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EvenementUser = sequelize.define('EvenementUser', {
    id_EventUser: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_evenement: {
      type: DataTypes.INTEGER,
      references: {
        model: 'evenement',
        key: 'id_evenement'
      }
    },
    id_user: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id_user'
      }
    },
    role_participation: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    date_inscription: {
      type: DataTypes.DATE
    },
    statut_participation: {
      type: DataTypes.ENUM('inscrit', 'confirme', 'present', 'absent', 'annule'),
      defaultValue: 'inscrit'
    },
    notes: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'evenementusers',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['id_user', 'id_evenement']
      }
    ]
  });

  // Associations
  EvenementUser.associate = (models) => {
    EvenementUser.belongsTo(models.Evenement, { foreignKey: 'id_evenement' });
    EvenementUser.belongsTo(models.User, { foreignKey: 'id_user' });
  };

  return EvenementUser;
};
