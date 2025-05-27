module.exports = (sequelize, DataTypes) => {
const ParcoursLieux = sequelize.define(
  "ParcoursLieux",
  {
    id_parcours_lieu: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_parcours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_lieu: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_evenement: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ordre: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "parcours_lieux",
    timestamps: true,
  }
);

ParcoursLieux.associate = (models) => {
  ParcoursLieux.belongsTo(models.Parcours, {
    foreignKey: "id_parcours",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  });

  ParcoursLieux.belongsTo(models.Lieu, {
    foreignKey: "id_lieu",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  });

  ParcoursLieux.belongsTo(models.Evenement, {
    foreignKey: "id_evenement",
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  });
};

return ParcoursLieux; }