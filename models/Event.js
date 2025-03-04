const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Lieu = require("./Lieu");
const User = require("./User");

const Event = sequelize.define('Event', {
    id_event: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: DataTypes.ENUM('Exposition', 'Atelier', 'Concert'),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    titre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    dateDebut: {
        type: DataTypes.DATE,
        allowNull: false
    },
    dateFin: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isAfter(value) {
            if (new Date(value) <= new Date(this.dateDebut)) {
              throw new Error('La date de fin doit être après la date de début.');
            }
          }
        }
    },
    id_lieu: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Lieu,
          key: 'id_lieu'
        },
        onDelete: 'CASCADE',  // Si un lieu est supprimé, les événements associés seront supprimés
        onUpdate: 'CASCADE'   // Si un lieu est mis à jour, les événements associés seront mis à jour
      },
      id_createur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: 'id_user'
        },
        onDelete: 'CASCADE',  // Si un créateur (utilisateur) est supprimé, les événements associés seront supprimés
        onUpdate: 'CASCADE'   // Si un créateur (utilisateur) est mis à jour, les événements associés seront mis à jour
      }      
});

module.exports = Event;
