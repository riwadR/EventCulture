// C:\Users\Dell\Documents\EventCulture\backend\models\Role.js

module.exports = (sequelize, DataTypes) => {
const Role = sequelize.define(
  "Role",
  {
    id_role: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom_role: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "Role",
    timestamps: false,
  }
);

Role.associate = (models) => {
  Role.belongsToMany(models.User, {
    through: models.UserRole,
    foreignKey: "id_role",
    otherKey: "id_user",
  });
};

return Role; }