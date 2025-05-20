const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  const EvenementOeuvre = sequelize.define('EvenementOeuvre', {
    id_evenement: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Evenement',
        key: 'id_evenement'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    id_oeuvre: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Oeuvre',
        key: 'id_oeuvre'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    id_presentateur: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',  // ou 'Personne' selon ta table utilisateurs
        key: 'id_user'  // ou 'id_personne'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  }, {
    tableName: 'EvenementOeuvre',
    timestamps: false
  });

  EvenementOeuvre.associate = (models) => {
    EvenementOeuvre.belongsTo(models.Evenement, { foreignKey: 'id_evenement' });
    EvenementOeuvre.belongsTo(models.Oeuvre, { foreignKey: 'id_oeuvre' });
    EvenementOeuvre.belongsTo(models.User, { foreignKey: 'id_presentateur', as: 'Presentateur' });
  };

  return EvenementOeuvre;
};