module.exports = (sequelize, DataTypes) => {
const User = sequelize.define(
  "User",
  {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100],
      },
    },
    prenom: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100],
      },
    },
    date_naissance: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: true,
        isBefore: new Date().toISOString().split("T")[0],
      },
    },
    nationalite: {
      type: DataTypes.STRING(50),
    },
     email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // 🔒 Rend l'email unique
      validate: {
        isEmail: true, // ✅ Validation de format
      },
    },
     password: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    biographie: {
      type: DataTypes.TEXT,
    },
    photo_url: {
      type: DataTypes.STRING(255),
      validate: {
        isUrl: true,
      },
    },
  },
  {
    tableName: "User",
    createdAt: "date_creation",
    updatedAt: "date_modification",
  }
);

User.associate = (models) => {
  User.belongsToMany(models.Role, {
    through: models.UserRole,
    foreignKey: "id_user",
    onDelete: "CASCADE",
  });
  User.belongsToMany(models.Evenement, {
    through: models.EvenementUser,
    foreignKey: "id_user",
    as: "EvenementsParticipes",
    onDelete: "CASCADE",
  });
  User.hasMany(models.EvenementOeuvre, {
    foreignKey: "id_presentateur",
    as: "Presentations",
  });
};

return User; }