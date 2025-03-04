const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const wilayas = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida",
  "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa",
  "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine",
  "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi",
  "Bordj Bou Arreridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa",
  "Relizane", "Etrangers"
];

const User = sequelize.define(
  "User",
  {
    id_user: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
    }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
    }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 100],
        isStrongPassword(value) {
          if (!/[A-Z]/.test(value) || !/[0-9]/.test(value) || !/[!@#$%^&*]/.test(value)) {
            throw new Error("Le mot de passe doit contenir une majuscule, un chiffre et un symbole.");
          }
        },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^\+\d{1,3}\d{9,15}$/,
      },
    },
    genre: {
      type: DataTypes.ENUM("Femme", "Homme"),
      allowNull: false,
    },
    departement: {
      type: DataTypes.ENUM(...wilayas),
      allowNull: false,
    },
    participation: {
      type: DataTypes.ENUM("Exposition uniquement", "Atelier uniquement", "Atelier et exposition"),
      allowNull: false,
    },
    autreParticipation: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        notEmpty: true
    }
    },
    photos: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Stocke les URLs des images
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = User;
