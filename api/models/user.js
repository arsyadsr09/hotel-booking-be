const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const User = sequelize.define('User', {
	firstName: DataTypes.STRING,
	lastName: DataTypes.STRING,
	email: { type: DataTypes.STRING, unique: true },
	password: DataTypes.STRING,
	createdAt: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW,
	},
	updatedAt: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW,
		onUpdate: DataTypes.NOW,
	},
})

module.exports = User
