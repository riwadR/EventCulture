// C:\Users\Dell\Documents\EventCulture\backend\models\Evenement.js
module.exports = (sequelize, DataTypes) => {
  const Evenement = sequelize.define(
    "Evenement",
    {
      id_evenement: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nom_evenement: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      date_debut: {
        type: DataTypes.DATE,
      },
      date_fin: {
        type: DataTypes.DATE,
      },
      contact_email: {
    type: DataTypes.STRING(255)
  },
  contact_telephone: {
    type: DataTypes.STRING(20)
  },
  image_url: {
    type: DataTypes.STRING(255)
  },
      id_lieu: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "lieu", // Changed to lowercase to match Lieu.js tableName
          key: "id_lieu",
        },
        onDelete: "RESTRICT",
      },
      id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user", // Changed to lowercase to match Lieu.js tableName
          key: "id_user",
        },
        onDelete: "RESTRICT",
      },
      id_type_evenement: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Type_Evenement",
          key: "id_type_evenement",
        },
        onDelete: "RESTRICT",
      },
    },
    {
      tableName: "Evenement",
      createdAt: "date_creation",
      updatedAt: "date_modification",
    }
  );

  Evenement.associate = (models) => {
    if (models.Lieu) {
      Evenement.belongsTo(models.Lieu, { foreignKey: "id_lieu" });
    }
    if (models.User) {
      Evenement.belongsTo(models.User, { foreignKey: "id_user" });
    }
    if (models.TypeEvenement) {
      Evenement.belongsTo(models.TypeEvenement, { foreignKey: "id_type_evenement" });
    } else {
      console.warn("Warning: TypeEvenement model not found");
    }
    if (models.User && models.EvenementUser) {
      Evenement.belongsToMany(models.User, {
        through: models.EvenementUser,
        foreignKey: "id_evenement",
        otherKey: "id_user",
        as: "Participants",
      });
    }
    if (models.Oeuvre && models.EvenementOeuvre) {
      Evenement.belongsToMany(models.Oeuvre, {
        through: models.EvenementOeuvre,
        foreignKey: "id_evenement",
        as: "OeuvresPresentation",
      });
    }
    if (models.EvenementUser) {
      Evenement.hasMany(models.EvenementUser, { foreignKey: "id_evenement" });
    }
    if (models.EvenementOeuvre) {
      Evenement.hasMany(models.EvenementOeuvre, { foreignKey: "id_evenement" });
    }
    if (models.Programme) {
      Evenement.hasMany(models.Programme, { foreignKey: "id_evenement" });
    } else {
      console.warn("Warning: Programme model not found");
    }
  };

  return Evenement;
};