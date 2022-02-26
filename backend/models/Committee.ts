import mongoose, { ObjectId } from 'mongoose'

interface CommitteeI {
	_id: ObjectId
	name: string
	slug: string
}

const CommitteeModel = mongoose.model<CommitteeI>(
	'Committee',
	new mongoose.Schema<CommitteeI>(
		{
			_id: { type: mongoose.Schema.Types.Number, required: true },
			name: { type: String, required: true },
			slug: { type: String, required: true },
		},
		{ _id: false }
	)
)

export { CommitteeModel }
export type { CommitteeI }
