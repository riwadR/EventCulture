
const sequelize = require("../config/database");
module.exports = (sequelize, DataTypes) => {
const Collection = sequelize.define(
  "Collection",
  {
    id_collection: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    date_creation: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    date_modification: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Collection",
    timestamps: true,
    createdAt: "date_creation",
    updatedAt: "date_modification",
  }
);

Collection.associate = (models) => {
  Collection.belongsToMany(models.Oeuvre, {
    through: models.OeuvreCollection,
    foreignKey: "id_collection",
    otherKey: "id_oeuvre",
    as: "Oeuvres",
  });
};

return Collection; }