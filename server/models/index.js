const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}



// Define associations
const syncDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
    await sequelize.sync({
      force: true
    }); // Use force:true to recreate tables
    console.log("Models synchronized!");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
};


db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.syncDB = syncDB;

module.exports = db;