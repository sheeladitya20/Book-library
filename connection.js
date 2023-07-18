const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('booklibrary', 'root', '', {
    host: 'localhost', 
    dialect: 'mysql', 
  });
  
// Test the database connection

sequelize.authenticate()
try{
console.log('Database connection has been established successfully.');
} catch (error) {
console.error('Unable to connect to the database:', error);
}

  sequelize.authenticate().then(() => console.log("database connected"))

  module.exports = sequelize;
