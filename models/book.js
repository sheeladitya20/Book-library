const  { DataTypes }  = require("sequelize");
const sequelize = require('../connection');

const Book = sequelize.define("Book", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

Book.sync({ force: false });
console.log("The table for the User model was just (re)created!");

module.exports = Book;