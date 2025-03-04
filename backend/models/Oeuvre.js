const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require('./User');

const Oeuvre = sequelize.define('Oeuvre', {
    id_oeuvre: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    titre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    prix: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING, // Stocke l'URL de l'image
        allowNull: false, // On autorise pas une Oeuvre sans image.
        validate: {
            isUrl: true, // Vérifie que la valeur est une URL valide
        }
    },
    id_createur: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id_user'
        }
    } 
});

module.exports = Oeuvre;