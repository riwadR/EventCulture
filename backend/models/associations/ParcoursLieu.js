const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ParcoursLieu = sequelize.define('ParcoursLieu', {
    id_parcours_lieu: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_parcours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'parcours',
        key: 'id_parcours'
      }
    },
    id_lieu: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'lieux',
        key: 'id_lieu'
      }
    },
    id_evenement: {
      type: DataTypes.INTEGER,
      references: {
        model: 'evenement',
        key: 'id_evenement'
      }
    },
    ordre: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'parcours_lieux',
    timestamps: true
  });

  // Associations
  ParcoursLieu.associate = (models) => {
    ParcoursLieu.belongsTo(models.Parcours, { foreignKey: 'id_parcours' });
    ParcoursLieu.belongsTo(models.Lieu, { foreignKey: 'id_lieu' });
    ParcoursLieu.belongsTo(models.Evenement, { foreignKey: 'id_evenement' });
  };

  return ParcoursLieu;
};