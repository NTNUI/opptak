import express from 'express'
import printSlug from 'ntnui-tools'

const group69 = { _id: 69, name: 'Group 69', slug: 'group-69' }

printSlug(group69)
console.log(group69.slug)

const testRouter = express.Router()

testRouter.get('/', (req, res) => {
	res.status(200).json({ msg: 'Hello! This is a test' })
})

export default testRouter
