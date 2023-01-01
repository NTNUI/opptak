import express from 'express'
import putStatus from 'controllers/statusController'
import authorization from 'utils/authorizationMiddleware'

const statusRouter = express.Router()

// @route PUT /statuses/:statusId
// @description Put status for application by id
// @access Private
statusRouter.put('/:statusId', authorization, putStatus)

export default statusRouter
