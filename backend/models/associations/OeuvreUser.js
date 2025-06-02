const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OeuvreUser = sequelize.define('OeuvreUser', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_oeuvre: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'oeuvre',
        key: 'id_oeuvre'
      }
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id_user'
      }
    },
    role_dans_oeuvre: {
      type: DataTypes.ENUM('auteur', 'realisateur', 'acteur', 'musicien', 'artiste', 'artisan', 'journaliste', 'scientifique', 'collaborateur', 'autre'),
      allowNull: false
    },
    personnage: {
      type: DataTypes.STRING(255)
    },
    ordre_apparition: {
      type: DataTypes.INTEGER
    },
    role_principal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    description_role: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'oeuvre_user',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['id_oeuvre', 'id_user', 'role_dans_oeuvre']
      }
    ]
  });

  // Associations
  OeuvreUser.associate = (models) => {
    OeuvreUser.belongsTo(models.Oeuvre, { foreignKey: 'id_oeuvre' });
    OeuvreUser.belongsTo(models.User, { foreignKey: 'id_user' });
  };

  return OeuvreUser;
};