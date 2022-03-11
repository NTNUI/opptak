import { Request, Response } from 'express'
import { CommitteeModel } from '../models/Committee'

const getCommittees = (_req: Request, res: Response) => {
	CommitteeModel.find()
		.then((committees) => res.json(committees))
		.catch((err) => res.status(404).json({ message: err.message }))
}

export default getCommittees
