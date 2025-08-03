const jwt = require('jsonwebtoken')
const { User } = require('../models')
const jwtSecret = process.env.JWT_SECRET

const auth = async (req, res, next) => {
	try {
		if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
			return res.status(401).json({ error: 'Unauthorized' })
		}

		const token = req.headers.authorization?.split(' ')[1]
		const decoded = jwt.verify(token, jwtSecret)
		req.user = await User.findByPk(decoded.data.id)

		if (!req.user) {
			return res.status(401).json({ error: 'Unauthorized' })
		}
		next()
	} catch {
		res.status(401).json({ error: 'Unauthorized' })
	}
}

module.exports = { auth }
