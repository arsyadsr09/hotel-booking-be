const express = require('express')
const { Booking, Room } = require('../models')
const { User } = require('../models')
const { auth } = require('../utils/jwt')

const router = express.Router()

// Create booking
router.post('/', auth, async (req, res) => {
	try {
		const { roomId, checkIn, checkOut, totalGuest, guestName, guestEmail, guestPhone } = req.body

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
			guestName,
			guestEmail,
			guestPhone,
			status: 'UPCOMING',
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

router.get('/', auth, async (req, res) => {
	try {
		const { status } = req.query

		const whereCondition = {
			UserId: req.user.id,
		}

		if (status) {
			whereCondition.status = status.toUpperCase()
		}

		const bookings = await Booking.findAll({
			where: whereCondition,
			include: [
				{
					model: Room,
				},
				{
					model: User,
					attributes: ['id', 'firstName', 'lastName', 'email'],
				},
			],
			order: [['createdAt', 'DESC']],
		})
		res.json({
			data: bookings || [],
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
			include: [{ model: Room }, { model: User, attributes: ['id', 'firstName', 'lastName', 'email'] }],
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
			message: 'Server error',
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
