const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Event = require('./Event');

const Programme = sequelize.define('Programme', {
    id_programme: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
    date_heure: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_event: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Event,
          key: 'id_event'
        },
        onDelete: 'CASCADE',  // Si un événement est supprimé, les programmes associés seront supprimés
        onUpdate: 'CASCADE'   // Si un événement est mis à jour, les programmes associés seront mis à jour
    }
});

module.exports = Programme;
