// C:\Users\Dell\Documents\EventCulture\backend\models\Daira.js
module.exports = (sequelize, DataTypes) => {
  const Daira = sequelize.define(
    "Daira",
    {
      id_daira: { // Changed from id to id_daira
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      wilaya_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "wilaya",
          key: "id_wilaya", // Updated to match Wilaya’s primary key
        },
        onDelete: "RESTRICT",
      },
    },
    {
      tableName: "daira",
      timestamps: false,
    }
  );

  Daira.associate = (models) => {
    Daira.belongsTo(models.Wilaya, { foreignKey: "wilaya_id" });
    Daira.hasMany(models.Commune, { foreignKey: "daira_id" });
  };

  return Daira;
};