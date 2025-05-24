module.exports = (sequelize, DataTypes) => {
  const Materiau = sequelize.define("Materiau", {
    id_materiau: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: "Materiau",
    timestamps: false
  });

  Materiau.associate = (models) => {
    Materiau.hasMany(models.Artisanat, { foreignKey: "id_materiau" });
  };

  return Materiau;
};
