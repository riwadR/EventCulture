module.exports = (sequelize, DataTypes) => {
const UserRole = sequelize.define(
  "UserRole",
  {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "User",
        key: "id_user",
      },
      onDelete: "CASCADE",
    },
    id_role: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "Role",
        key: "id_role",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "User_Role",
    timestamps: false,
  }
);

UserRole.associate = (models) => {
  UserRole.belongsTo(models.User, { foreignKey: "id_user" });
  UserRole.belongsTo(models.Role, { foreignKey: "id_role" });
};

return UserRole; }