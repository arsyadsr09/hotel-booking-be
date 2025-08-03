require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { sequelize, Room } = require('./models')
const authRoutes = require('./routes/auth')
const bookingRoutes = require('./routes/booking')
const roomRoutes = require('./routes/room')

const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/bookings', bookingRoutes)

app.get('/api', (req, res) => {
	res.send('Hotel Booking API')
})

app.use((err, req, res, next) => {
	console.error('Unhandled error:', err) // 👈 logs to Vercel
	res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, async () => {
	console.log(`Server is running on port ${PORT}`)

	// await Room.bulkCreate([
	// 	{
	// 		image:
	// 			'https://www.usatoday.com/gcdn/authoring/authoring-images/2024/05/26/USAT/73865433007-tempoby-hilton-nashville-standard-king.jpg?width=1733&height=1176&fit=crop&format=pjpg&auto=webp',
	// 		name: 'King Deluxe Room with Garden View',
	// 		info: 'Refund & reschedule not allowed',
	// 		facilities: [
	// 			{ icon: 'PhPerson', label: '1 Guest' },
	// 			{ icon: 'PhBed', label: 'King' },
	// 			{ icon: 'PhForkKnife', label: 'Breakfast (1 pax)' },
	// 			{ icon: 'PhWifiHigh', label: 'Wifi' },
	// 			{ icon: 'PhGift', label: 'Coffee & tea, Drinking water' },
	// 		],
	// 		price: 750,
	// 		afterTax: 900,
	// 	},
	// 	{
	// 		image:
	// 			'https://asset.kompas.com/crops/33vZ6Rt128kzOfcC_aU3fy7oo0I=/0x36:640x463/750x500/data/photo/2020/07/10/5f081b41cc76c.jpeg',
	// 		name: 'Twin Room with City View',
	// 		info: 'Free cancellation before 24 hours',
	// 		facilities: [
	// 			{ icon: 'PhPerson', label: '2 Guests' },
	// 			{ icon: 'PhBed', label: 'Twin' },
	// 			{ icon: 'PhForkKnife', label: 'Breakfast (2 pax)' },
	// 			{ icon: 'PhWifiHigh', label: 'Wifi' },
	// 			{ icon: 'PhGift', label: 'Mineral water' },
	// 		],
	// 		price: 850,
	// 		afterTax: 1020,
	// 	},
	// 	{
	// 		name: 'Suite Room with Balcony',
	// 		image: 'https://blog.bookingtogo.com/wp-content/uploads/2021/12/jenis-jenis-kamar-hotel.jpg',
	// 		info: 'Refundable, reschedule allowed',
	// 		facilities: [
	// 			{ icon: 'PhPerson', label: '3 Guests' },
	// 			{ icon: 'PhBed', label: 'King + Sofa' },
	// 			{ icon: 'PhForkKnife', label: 'Breakfast (3 pax)' },
	// 			{ icon: 'PhWifiHigh', label: 'Wifi' },
	// 			{ icon: 'PhGift', label: 'Coffee machine, Snacks' },
	// 		],
	// 		price: 1200,
	// 		afterTax: 1450,
	// 	},
	// ])
})

// module.exports = app

// sequelize.sync({ force: true })
// .then(async () => {
// 	// Sample rooms -> Enable when needed
// })
