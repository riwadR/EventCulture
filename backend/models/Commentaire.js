
module.exports = (sequelize, DataTypes) => {

// Import the User model correctly
const User = require("./User");

const Commentaire = sequelize.define(
  "Commentaire",
  {
    id_commentaire: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contenu: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date_creation: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    // Add other fields as needed
  },
  {
    tableName: "Commentaire",
    createdAt: "date_creation",
    updatedAt: "date_modification",
  }
);

// Define associations
Commentaire.associate = (models) => {
  Commentaire.belongsTo(models.User, { foreignKey: "id_user" });
  // Add other associations as needed
};

return Commentaire; }