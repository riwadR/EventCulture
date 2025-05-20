// C:\Users\Dell\Documents\EventCulture\backend\models\Wilaya.js
module.exports = (sequelize, DataTypes) => {
  const Wilaya = sequelize.define(
    "Wilaya",
    {
      id_wilaya: { // Changed from id to id_wilaya
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "wilaya",
      timestamps: false,
    }
  );

  Wilaya.associate = (models) => {
    Wilaya.hasMany(models.Daira, { foreignKey: "wilaya_id" });
  };

  return Wilaya;
};