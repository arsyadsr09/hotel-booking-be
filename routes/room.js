const express = require('express')
const router = express.Router()
const { Room } = require('../models')

// GET /api/rooms - Public
router.get('/', async (req, res) => {
	try {
		const rooms = await Room.findAll({
			order: [['id', 'ASC']],
		})

		res.json({
			data: rooms,
			status: 'success',
			message: 'Rooms retrieved successfully',
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

module.exports = router
