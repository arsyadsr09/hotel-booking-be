const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models')

const router = express.Router()
const jwtSecret = process.env.JWT_SECRET

router.post('/register', async (req, res) => {
	const { firstName, lastName, email, password } = req.body
	const hash = await bcrypt.hash(password, 10)
	try {
		const user = await User.create({ firstName, lastName, email, password: hash })

		const userData = user.toJSON()
		delete userData.password

		const token = jwt.sign({ data: userData }, jwtSecret, { expiresIn: '24h' })

		res.json({
			data: { user: userData, token },
			status: 'success',
		})
	} catch (err) {
		if (err.name === 'SequelizeUniqueConstraintError') {
			return res.status(400).json({ error: 'Email already exists' })
		}
		console.error(err)
		res.status(500).json({
			data: null,
			status: 'error',
			message: 'Server error',
		})
	}
})

router.post('/login', async (req, res) => {
	const { email, password } = req.body
	const user = await User.findOne({ where: { email } })
	if (!user) return res.status(404).json({ error: 'User not found' })

	const isMatch = await bcrypt.compare(password, user.password)
	if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' })

	const userData = user.toJSON()
	delete userData.password

	const token = jwt.sign({ data: userData }, jwtSecret, { expiresIn: '24h' })

	res.json({
		data: { user: userData, token },
		status: 'success',
	})
})

module.exports = router
