// C:\Users\Dell\Documents\EventCulture\backend\models\CritiqueEvaluation.js

module.exports = (sequelize, DataTypes) => {

const CritiqueEvaluation = sequelize.define(
  "CritiqueEvaluation",
  {
    id_critique: {
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
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id_user",
      },
      onDelete: "CASCADE",
    },
    note: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 10,
      },
    },
    commentaire: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date_creation: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Critique_Evaluation",
    timestamps: true,
    createdAt: "date_creation",
    updatedAt: "date_modification",
  }
);

CritiqueEvaluation.associate = (models) => {
  CritiqueEvaluation.belongsTo(models.Oeuvre, { foreignKey: "id_oeuvre" });
  CritiqueEvaluation.belongsTo(models.User, { foreignKey: "id_user" });
};

return CritiqueEvaluation; }