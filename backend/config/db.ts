import mongoose from 'mongoose'

const db = 'mongodb+srv://bolle:bolle@kanelbolle.yopil.mongodb.net/wienerbread'

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
