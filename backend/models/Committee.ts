import mongoose from 'mongoose'
import MembershipType from '../utils/enums'

interface ICommittee {
	_id: number
	name: string
	slug: string
	accepts_admissions: boolean
	access_roles: string[]
}

const CommitteeModel = mongoose.model<ICommittee>(
	'Committee',
	new mongoose.Schema<ICommittee>({
		_id: { type: Number, required: true },
		name: { type: String, required: true },
		slug: { type: String, required: true },
		accepts_admissions: { type: Boolean, required: true },
		access_roles: [{ type: String, enum: MembershipType, required: true }],
	})
)

export { CommitteeModel }
export type { ICommittee }
