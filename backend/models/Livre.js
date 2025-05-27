module.exports = (sequelize, DataTypes) => {

// Modèle Livre
const Livre = sequelize.define('Livre', {
  id_livre: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_oeuvre: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  isbn: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  nb_pages: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

}, {
  tableName: 'Livre',
  timestamps: false
});

Livre.associate = models => {
  Livre.belongsTo(models.Oeuvre, { foreignKey: 'id_oeuvre' });
};

return Livre; }
