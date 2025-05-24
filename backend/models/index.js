
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

// Import the Sequelize instance from your db connection file
// The path may need to be adjusted based on where your database config is located
const sequelize = require('../config/database'); // Adjust this path as needed - could be '../database', etc.

// Read all model files in the directory
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&      // Exclude hidden files
      file !== basename &&            // Exclude this index.js file
      file.slice(-3) === '.js' &&     // Only include .js files
      file.indexOf('.test.js') === -1 // Exclude test files
    );
  })
  .forEach(file => {
    try {
      // Import the model file
      const modelDefiner = require(path.join(__dirname, file));
      
      // Check if it's a function before calling it
      if (typeof modelDefiner === 'function') {
        const model = modelDefiner(sequelize, Sequelize.DataTypes);
        
        // Verify the model exists and has a name before adding it to db
        if (model && model.name) {
          db[model.name] = model;
        } else {
          console.warn(`Warning: Model in file ${file} did not return a valid model object`);
        }
      } else {
        console.warn(`Warning: File ${file} does not export a model function`);
      }
    } catch (error) {
      console.error(`Error loading model from file ${file}:`, error);
    }
  });

// Set up associations between models
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Add sequelize instance and Sequelize class to the exports
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;