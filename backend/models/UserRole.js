module.exports = (sequelize, DataTypes) => {
const UserRole = sequelize.define(
  "UserRole",
  {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    id_role: {
      type: DataTypes.INTEGER,
     
      allowNull: false,
      references: {
        model: "Role",
        key: "id_role",
      },
      onDelete: "CASCADE",
    },
  },

  {
  indexes: [
    {
      unique: true,
      fields: ['id_user', 'id_role']
    }
  ]
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