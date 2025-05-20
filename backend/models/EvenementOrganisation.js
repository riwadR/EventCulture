module.exports = (sequelize, DataTypes) => {
  const EvenementOrganisation = sequelize.define(
    "EvenementOrganisation",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_evenement: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Evenement",
          key: "id_evenement"
        },
        onDelete: "CASCADE"
      },
      id_organisation: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Organisation",
          key: "id_organisation"
        },
        onDelete: "CASCADE"
      },
      role: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      tableName: "EvenementOrganisation",
      timestamps: true,
      createdAt: "date_creation",
      updatedAt: "date_modification"
    }
  );

  EvenementOrganisation.associate = (models) => {
    // The issue is on this line - models.Organisation might not exist
    // Add a conditional check to prevent the error
    
    if (models.Evenement) {
      EvenementOrganisation.belongsTo(models.Evenement, {
        foreignKey: "id_evenement"
      });
    } else {
      console.warn("Warning: Evenement model not found");
    }
    
    if (models.Organisation) {
      EvenementOrganisation.belongsTo(models.Organisation, {
        foreignKey: "id_organisation"
      });
    } else {
      console.warn("Warning: Organisation model not found - this is likely causing the error");
      // You need to create an Organisation model
    }
  };

  return EvenementOrganisation;
};