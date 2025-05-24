module.exports = (sequelize, DataTypes) => {
const Programme = sequelize.define(
  "Programme",
  {
    id_programme: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date_heure: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    id_evenement: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Programme",
    timestamps: false,
  }
);

Programme.associate = (models) => {
  Programme.belongsTo(models.Evenement, {
    foreignKey: "id_evenement",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

return Programme; }