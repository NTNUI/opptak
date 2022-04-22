import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const db = process.env.DB_URI || ''

const connectDB = async () => {
	try {
		await mongoose.connect(db)

		console.log('✨ MongoDB connected') // eslint-disable-line no-console
	} catch (err: any) {
		console.error(err.message) // eslint-disable-line no-console
		process.exit(1)
	}
}

export default connectDB
