const express = require('express')
const { Booking, Room } = require('../models')
const jwt = require('jsonwebtoken')
const { User } = require('../models')

const router = express.Router()
const jwtSecret = process.env.JWT_SECRET

const auth = async (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(' ')[1]
		const decoded = jwt.verify(token, jwtSecret)
		req.user = await User.findByPk(decoded.id)
		next()
	} catch {
		res.status(401).json({ error: 'Unauthorized' })
	}
}

// Create booking
router.post('/', auth, async (req, res) => {
	try {
		const { roomId, checkIn, checkOut, totalGuest } = req.body

		const room = await Room.findByPk(roomId)
		if (!room) return res.status(404).json({ error: 'Room not found' })

		const nights = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)

		if (nights <= 0) {
			return res.status(400).json({ error: 'Invalid check-in/check-out' })
		}

		const subTotal = room.price * nights
		const grandTotal = room.afterTax * nights

		const booking = await Booking.create({
			UserId: req.user.id,
			RoomId: room.id,
			checkIn,
			checkOut,
			totalGuest,
			subTotal,
			grandTotal,
			status: 'UPCOMING', // default
		})

		res.json({
			data: booking,
			status: 'success',
		})
	} catch (err) {
		console.error(err)
		res.status(500).json({
			data: null,
			status: 'error',
			message: 'Server error',
		})
	}
})

// Get all bookings of current user
router.get('/', auth, async (req, res) => {
	try {
		const bookings = await Booking.findAll({
			where: { UserId: req.user.id },
			include: [
				{
					model: Room,
				},
				{
					model: User,
					attributes: ['id', 'name', 'email'],
				},
			],
			order: [['createdAt', 'DESC']],
		})
		res.json({
			data: bookings,
			status: 'success',
		})
	} catch (err) {
		console.error(err)
		res.status(500).json({
			data: null,
			status: 'error',
			message: 'Server error',
		})
	}
})

router.get('/:bookingId', auth, async (req, res) => {
	try {
		const booking = await Booking.findOne({
			where: { bookingId: req.params.bookingId },
			include: [
				{ model: Room }, // includes Room data
				{ model: User, attributes: ['id', 'name', 'email'] }, // includes limited User fields
			],
		})

		if (!booking) return res.status(404).json({ error: 'Booking not found' })
		res.json({
			data: booking,
			status: 'success',
		})
	} catch (err) {
		res.status(500).json({
			data: null,
			status: 'error',
			message: 'Server error'
		})
	}
})

router.put('/:id/status', auth, async (req, res) => {
	const { status } = req.body

	if (!['UPCOMING', 'FINISH', 'CANCEL'].includes(status)) {
		return res.status(400).json({ error: 'Invalid status' })
	}

	const booking = await Booking.findByPk(req.params.id)
	if (!booking) return res.status(404).json({ error: 'Booking not found' })

	booking.status = status
	await booking.save()

	res.json({
		data: booking,
		status: 'success',
	})
})

module.exports = router
