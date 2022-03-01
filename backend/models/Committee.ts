import mongoose from 'mongoose'

interface CommitteeI {
	_id: Number
	name: string
	slug: string
}

const CommitteeModel = mongoose.model<CommitteeI>(
	'Committee',
	new mongoose.Schema<CommitteeI>({
		_id: { type: Number, required: true },
		name: { type: String, required: true },
		slug: { type: String, required: true },
	})
)

export { CommitteeModel }
export type { CommitteeI }
