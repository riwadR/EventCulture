
module.exports = (sequelize, DataTypes) => {
const EvenementOeuvre = sequelize.define(
  "EvenementOeuvre",
  {
    id_EventOeuvre: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
    id_evenement: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Evenement",
        key: "id_evenement",
      },
      onDelete: "CASCADE",
    },
    id_oeuvre: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Oeuvre",
        key: "id_oeuvre",
      },
      onDelete: "CASCADE",
    },
    id_presentateur: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "User",
        key: "id_user",
      },
      onDelete: "SET NULL",
    },
  },
  {
    tableName: "Evenement_Oeuvre",
    timestamps: false,
  }
);

EvenementOeuvre.associate = (models) => {
  EvenementOeuvre.belongsTo(models.Evenement, { foreignKey: "id_evenement" });
  EvenementOeuvre.belongsTo(models.Oeuvre, { foreignKey: "id_oeuvre" });
  EvenementOeuvre.belongsTo(models.User, {
    foreignKey: "id_presentateur",
    as: "Presentateur",
  });
};

return EvenementOeuvre; }