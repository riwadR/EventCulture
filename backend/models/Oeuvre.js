module.exports = (sequelize, DataTypes) => {

const Oeuvre = sequelize.define(
  "Oeuvre",
  {
    id_oeuvre: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    id_type_oeuvre: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Type_Oeuvre",
        key: "id_type_oeuvre",
      },
      onDelete: "RESTRICT",
    },
     id_langue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Langue",
        key: "id_langue",
      },
      onDelete: "RESTRICT",
    },
    annee_creation: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.TEXT,
    },
    image_url: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "Oeuvre",
    createdAt: "date_creation",
    updatedAt: "date_modification",
  }
);

Oeuvre.associate = (models) => {
  Oeuvre.belongsTo(models.TypeOeuvre, { foreignKey: "id_type_oeuvre" });
    Oeuvre.belongsTo(models.Langue, { foreignKey: "id_langue" });
  Oeuvre.hasOne(models.Livre, { foreignKey: "id_oeuvre" });
  Oeuvre.hasOne(models.Film, { foreignKey: "id_oeuvre" });
  Oeuvre.hasOne(models.AlbumMusical, { foreignKey: "id_oeuvre" });
  Oeuvre.hasOne(models.OeuvreArt, { foreignKey: "id_oeuvre" });
  Oeuvre.hasOne(models.Artisanat, { foreignKey: "id_oeuvre" });
  Oeuvre.hasMany(models.Media, { foreignKey: "id_oeuvre" });
  Oeuvre.hasMany(models.CritiqueEvaluation, { foreignKey: "id_oeuvre" });
  Oeuvre.belongsToMany(models.Evenement, {
    through: models.EvenementOeuvre,
    foreignKey: "id_oeuvre",
    as: "EvenementsPresentation",
  });
};

return Oeuvre; }