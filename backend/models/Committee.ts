import mongoose from 'mongoose'
import MembershipType from '../utils/enums'

interface CommitteeI {
	_id: number
	name: string
	slug: string
	accepts_applicants: boolean
	access_roles: string[]
}

const CommitteeModel = mongoose.model<CommitteeI>(
	'Committee',
	new mongoose.Schema<CommitteeI>({
		_id: { type: Number, required: true },
		name: { type: String, required: true },
		slug: { type: String, required: true },
		accepts_applicants: { type: Boolean, required: true },
		access_roles: [{ type: String, enum: MembershipType, required: true }],
	})
)

export { CommitteeModel }
export type { CommitteeI }
