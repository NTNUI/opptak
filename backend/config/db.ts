/* eslint-disable no-console */
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import mockDb from "./mockDb"

dotenv.config()

let db = process.env.DB_URI || ''

const connectDB = async () => {
	if (process.env.NODE_ENV === 'test') {
		await mockDb.connect()
		console.log('🔨 In-memory test database connected')
		return
	}

	try {
		await mongoose.connect(db)
		console.log('✨ MongoDB connected')
	} catch (err: any) {
		console.error(err.message)
		process.exit(1)
	}
}

export default connectDB
