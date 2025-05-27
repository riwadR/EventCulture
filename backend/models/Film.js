module.exports = (sequelize, DataTypes) => {

// Modèle Film
const Film = sequelize.define('Film', {
  id_film: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_oeuvre: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  duree_minutes: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  realisateur: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'Film',
  timestamps: false
});

Film.associate = models => {
  Film.belongsTo(models.Oeuvre, { foreignKey: 'id_oeuvre' });
};

return Film;}
