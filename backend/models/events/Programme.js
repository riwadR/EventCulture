const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Programme = sequelize.define('Programme', {
    id_programme: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    id_evenement: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'evenement',
        key: 'id_evenement'
      }
    },
    id_lieu: {
      type: DataTypes.INTEGER,
      references: {
        model: 'lieux',
        key: 'id_lieu'
      }
    },
    heure_debut: {
      type: DataTypes.DATE
    },
    heure_fin: {
      type: DataTypes.DATE
    },
    lieu_specifique: {
      type: DataTypes.STRING(255)
    },
    ordre: {
      type: DataTypes.INTEGER
    },
    statut: {
      type: DataTypes.ENUM('planifie', 'en_cours', 'termine', 'annule', 'reporte')
    },
    type_activite: {
      type: DataTypes.ENUM('conference', 'atelier', 'spectacle', 'exposition', 'visite', 'degustation', 'projection', 'concert', 'lecture', 'debat', 'formation', 'ceremonie', 'autre')
    },
    duree_estimee: {
      type: DataTypes.INTEGER
    },
    nb_participants_max: {
      type: DataTypes.INTEGER
    },
    materiel_requis: {
      type: DataTypes.TEXT
    },
    notes_organisateur: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'programme',
    timestamps: true,
    createdAt: 'date_creation',
    updatedAt: 'date_modification'
  });

  // Associations
  Programme.associate = (models) => {
    Programme.belongsTo(models.Evenement, { foreignKey: 'id_evenement' });
    Programme.belongsTo(models.Lieu, { foreignKey: 'id_lieu' });
    
    Programme.belongsToMany(models.User, { 
      through: models.ProgrammeIntervenant, 
      foreignKey: 'id_programme' 
    });
  };

  return Programme;
};