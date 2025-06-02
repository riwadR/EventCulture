const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Media = sequelize.define('Media', {
    id_media: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_oeuvre: {
      type: DataTypes.INTEGER,
      references: {
        model: 'oeuvre',
        key: 'id_oeuvre'
      }
    },
    id_evenement: {
      type: DataTypes.INTEGER,
      references: {
        model: 'evenement',
        key: 'id_evenement'
      }
    },
    type_media: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'media',
    timestamps: false
  });

  // Associations
  Media.associate = (models) => {
    Media.belongsTo(models.Oeuvre, { foreignKey: 'id_oeuvre' });
    Media.belongsTo(models.Evenement, { foreignKey: 'id_evenement' });
  };

  return Media;
};