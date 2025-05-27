
module.exports = (sequelize, DataTypes) => {

const Categorie = sequelize.define(
  "Categorie",
  {
    id_categorie: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
   
  },
  {
    tableName: "Categorie",
    timestamps: false,
  }
);

Categorie.associate = (models) => {
    // There seems to be confusion in your association:
    // You're trying to associate Categorie with Evenement
    // But using OeuvreCategorie as the through table and 
    // referencing id_Oeuvre as the otherKey
    
    
    // Option 2: If you want to associate Categorie with Oeuvre:
    Categorie.belongsToMany(models.Oeuvre, {
      through: models.OeuvreCategorie,
      foreignKey: "id_categorie",
      otherKey: "id_oeuvre",
      as: "Oeuvres"
    });
    
    // Use one of the above options based on your data model,
    // not both unless you need both relationships
  };

return Categorie; }