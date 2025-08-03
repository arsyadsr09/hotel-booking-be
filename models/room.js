const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Room = sequelize.define('Room', {
  name: DataTypes.STRING,
  image: DataTypes.STRING,
  info: DataTypes.STRING,
  facilities: {
    type: DataTypes.JSON, // Will store array of { icon, label }
    allowNull: false
  },
  price: DataTypes.FLOAT,
  afterTax: DataTypes.FLOAT
});

module.exports = Room;
