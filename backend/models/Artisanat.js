module.exports = (sequelize, DataTypes) => {
  const Artisanat = sequelize.define("Artisanat", {
    id_artisanat: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_oeuvre: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Oeuvre",
        key: "id_oeuvre",
      },
      onDelete: "CASCADE",
    },
    id_materiau: {
      type: DataTypes.INTEGER,
      references: {
        model: "Materiau",
        key: "id_materiau",
      },
      allowNull: true,
    },
    id_technique: {
      type: DataTypes.INTEGER,
      references: {
        model: "Technique",
        key: "id_technique",
      },
      allowNull: true,
    },
    dimensions: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    poids: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    prix: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    date_creation: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: "Artisanat",
    timestamps: false,
  });

  Artisanat.associate = (models) => {
    Artisanat.belongsTo(models.Oeuvre, { foreignKey: "id_oeuvre" });
    Artisanat.belongsTo(models.Materiau, { foreignKey: "id_materiau" });
    Artisanat.belongsTo(models.Technique, { foreignKey: "id_technique" });
  };

  return Artisanat;
};
