// models/OeuvreUser.js
module.exports = (sequelize, DataTypes) => {
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
        model: 'Oeuvre',
        key: 'id_oeuvre'
      },
      onDelete: 'CASCADE'
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id_user'
      },
      onDelete: 'CASCADE'
    },
    role_dans_oeuvre: {
      type: DataTypes.ENUM(
        'auteur',
        'realisateur', 
        'acteur',
        'musicien',
        'artiste',
        'artisan',
        'journaliste',
        'scientifique',
        'collaborateur',
        'autre'
      ),
      allowNull: false,
      comment: 'Rôle de l\'utilisateur dans cette œuvre'
    },
    personnage: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Nom du personnage joué (pour les acteurs)'
    },
    ordre_apparition: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Ordre d\'apparition dans les crédits'
    },
    role_principal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Rôle principal ou secondaire'
    },
    description_role: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description détaillée du rôle'
    }
  }, {
    tableName: 'Oeuvre_User',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['id_oeuvre', 'id_user', 'role_dans_oeuvre']
      },
      {
        fields: ['role_dans_oeuvre']
      },
      {
        fields: ['role_principal']
      }
    ]
  });

  OeuvreUser.associate = (models) => {
    OeuvreUser.belongsTo(models.Oeuvre, { foreignKey: 'id_oeuvre' });
    OeuvreUser.belongsTo(models.User, { foreignKey: 'id_user' });
  };

  return OeuvreUser;
};