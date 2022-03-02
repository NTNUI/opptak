import express from 'express'
import testConnection from 'ntnui-tools'

testConnection()

const testRouter = express.Router()

testRouter.get('/', (req, res) => {
	res.status(200).json({ msg: 'Hello! This is a test' })
})

export default testRouter
