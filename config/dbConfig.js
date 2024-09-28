const { Sequelize } = require('sequelize');

// Database configuration
const sequelize = new Sequelize('mydb', 'root', 'kartik', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
