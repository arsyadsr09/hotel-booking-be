const sequelize = require('../config/database');
const User = require('./user');
const Room = require('./room');
const Booking = require('./booking');

// Associations
User.hasMany(Booking);
Booking.belongsTo(User);

Room.hasMany(Booking);
Booking.belongsTo(Room);

module.exports = {
  sequelize,
  User,
  Room,
  Booking
};
