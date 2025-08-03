const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Booking = sequelize.define('Booking', {
	bookingId: {
		type: DataTypes.STRING,
		unique: true,
	},
	checkIn: DataTypes.DATEONLY,
	checkOut: DataTypes.DATEONLY,
	totalGuest: DataTypes.INTEGER,
	subTotal: DataTypes.FLOAT,
	grandTotal: DataTypes.FLOAT,
	guestName: DataTypes.STRING,
	guestEmail: DataTypes.STRING,
	guestPhone: DataTypes.STRING,
	status: {
		type: DataTypes.ENUM('UPCOMING', 'FINISH', 'CANCEL'),
		defaultValue: 'UPCOMING',
	},
})

// Hook to generate bookingId after record is created
Booking.afterCreate(async (booking) => {
	const year = new Date().getFullYear()
	const formatted = `ID-${year}${String(booking.id).padStart(4, '0')}`

	booking.bookingId = formatted
	await booking.save() // persist generated bookingId
})

module.exports = Booking
