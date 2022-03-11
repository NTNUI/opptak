import mongoose from 'mongoose'
import MembershipType from '../utils/enums'

interface IRoleInCommittee {
	committee: number
	role: string
}

interface IUser {
	_id: number
	committees: IRoleInCommittee[]
}

const RoleInSchema = new mongoose.Schema<IRoleInCommittee>(
	{
		committee: { type: Number, ref: 'Committee', required: true },
		role: { type: String, enum: MembershipType, required: true },
	},
	{ _id: false }
)

const UserSchema = new mongoose.Schema<IUser>({
	_id: { type: Number, required: true },
	committees: {
		type: [RoleInSchema],
		validate: [
			(val: []) => val.length > 0,
			'There must be at least one committee',
		],
	},
})

const UserModel = mongoose.model<IUser>('User', UserSchema)

export { UserModel }
export type { IUser, IRoleInCommittee }