// C:\Users\Dell\Documents\EventCulture\backend\models\Commune.js
module.exports = (sequelize, DataTypes) => {
  const Commune = sequelize.define(
    "Commune",
    {
      id_commune: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      daira_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "daira",
          key: "id_daira", // Updated to match Daira’s primary key
        },
        onDelete: "RESTRICT",
      },
    },
    {
      tableName: "commune",
      timestamps: false,
    }
  );

  Commune.associate = (models) => {
    Commune.belongsTo(models.Daira, { foreignKey: "daira_id" });
    Commune.hasMany(models.Lieu, { foreignKey: "commune_id" });
  };

  return Commune;
};