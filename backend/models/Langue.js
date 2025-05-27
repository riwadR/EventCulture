// models/langue.js
module.exports = (sequelize, DataTypes) => {
  const Langue = sequelize.define('Langue', {
    id_langue: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: true, // ex: fr, ar, en
    },
  }, {
    tableName: 'Langue',
    timestamps: false,
  });

  Langue.associate = models => {
    Langue.hasMany(models.Oeuvre, {
      foreignKey: 'id_langue',
      as: 'oeuvres',
    });
  };

  return Langue;
};
