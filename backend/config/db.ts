import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();

const db = process.env.DB_URI || ""

const connectDB = async () => {
	try {
		await mongoose.connect(db)

		console.log('MongoDB connected')
	} catch (err: any) {
		console.error(err.message)
		process.exit(1)
	}
}

export default connectDB
