const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
module.exports = (sequelize, DataTypes) => {
  const EvenementUser = sequelize.define('EvenementUser', {
    id_evenement: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Evenement',
        key: 'id_evenement'
      }
    },
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'id_user'
      }
    },
    role_participation: {
      type: DataTypes.STRING(100), // Exemple: 'organisateur', 'participant', 'conférencier'
      allowNull: false
    },
    date_inscription: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    statut_participation: {
      type: DataTypes.ENUM('inscrit', 'confirme', 'present', 'absent', 'annule'),
      defaultValue: 'inscrit'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'EvenementUser',
    timestamps: false
  });

  EvenementUser.associate = (models) => {
    EvenementUser.belongsTo(models.Evenement, {
      foreignKey: 'id_evenement',
      onDelete: 'CASCADE'
    });
    EvenementUser.belongsTo(models.User, {
      foreignKey: 'id_user',
      onDelete: 'CASCADE'
    });
  };

  return EvenementUser;
};
