const express = require('express')
const router = express.Router()
const { Room } = require('../models')

router.get('/', async (req, res) => {
	try {
		const rooms = await Room.findAll({
			order: [['id', 'ASC']],
		})

		res.json({
			data: rooms || [],
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

router.get('/:id', async (req, res) => {
	try {
		const room = await Room.findByPk(req.params.id)

		if (!room) {
			return res.status(404).json({
				data: null,
				status: 'error',
				message: 'Room not found',
			})
		}

		res.json({
			data: room,
			status: 'success',
			message: 'Room retrieved successfully',
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
