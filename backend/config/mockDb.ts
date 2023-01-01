import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer: MongoMemoryServer

const connect = async () => {
	mongoServer = await MongoMemoryServer.create()
	await mongoose.connect(mongoServer.getUri())
}

const close = async () => {
	await mongoose.connection.dropDatabase()
	await mongoose.connection.close()
	await mongoServer.stop()
}

const clear = async () => {
	const { collections } = mongoose.connection
	Object.values(collections).forEach((value) => value.deleteMany({}))
}
export default { connect, close, clear }
