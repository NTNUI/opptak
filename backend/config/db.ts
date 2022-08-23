/* eslint-disable no-console */
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import {MongoMemoryServer} from 'mongo-memory-server';


dotenv.config()

let db = process.env.DB_URI || ''

const connectDB = async () => {
	if process.env.NODE_ENV === 'test' {
		console.log('Using test server')
		const mongod = await MongoMemoryServer.create();
		db = mongod.getUri();
	}

	try {
		await mongoose.connect(db)
		console.log('✨ MongoDB connected')
	} catch (err: any) {
		console.error(err.message)
		process.exit(1)
	}
}

export const connectMockDB = async () => {

}

export default connectDB
