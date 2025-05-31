const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EvenementOeuvre = sequelize.define('EvenementOeuvre', {
    id_EventOeuvre: {
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
    id_oeuvre: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'oeuvre',
        key: 'id_oeuvre'
      }
    },
    id_presentateur: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id_user'
      }
    }
  }, {
    tableName: 'evenement_oeuvre',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['id_evenement', 'id_oeuvre']
      }
    ]
  });

  // Associations
  EvenementOeuvre.associate = (models) => {
    EvenementOeuvre.belongsTo(models.Evenement, { foreignKey: 'id_evenement' });
    EvenementOeuvre.belongsTo(models.Oeuvre, { foreignKey: 'id_oeuvre' });
    EvenementOeuvre.belongsTo(models.User, { as: 'Presentateur', foreignKey: 'id_presentateur' });
  };

  return EvenementOeuvre;
};
