
module.exports = (sequelize, DataTypes) => {
const Artisanat = sequelize.define(
  "Artisanat",
  {
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
    materiau: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "Artisanat",
    timestamps: false,
  }
);

Artisanat.associate = (models) => {
  Artisanat.belongsTo(models.Oeuvre, { foreignKey: "id_oeuvre" });
};

return Artisanat; }