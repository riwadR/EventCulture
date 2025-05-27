module.exports = (sequelize, DataTypes) => {

const OeuvreArt = sequelize.define(
  "OeuvreArt",
  {
    id_oeuvre_art: {
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
    technique: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "Oeuvre_Art",
    timestamps: false,
  }
);

OeuvreArt.associate = (models) => {
  OeuvreArt.belongsTo(models.Oeuvre, { foreignKey: "id_oeuvre" });
};

return OeuvreArt; }