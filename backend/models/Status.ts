import mongoose from 'mongoose'
import { StatusTypes } from '../utils/enums'

interface IStatus {
	_id: mongoose.Types.ObjectId
	value: string
	set_by: string | null
	committee: number
	updated_date: string
}

interface Enum {
	[id: number]: string
}

function stringifyEnum(enumVal: Enum): String {
	const enumArr = Object.values(enumVal)
	return enumArr.reduce((el1, el2, idx) => {
		if (idx !== enumArr.length - 1) {
			return `${el1}, ${el2}`
		}
		return `${el1} and ${el2}`
	})
}

const statusSchema = new mongoose.Schema<IStatus>(
	{
		value: {
			type: String,
			enum: {
				values: Object.values(StatusTypes),
				message: `{VALUE} is not a supported value. Valid values are ${stringifyEnum(
					StatusTypes
				)}`,
			},
			required: true,
			default: StatusTypes.PENDING,
		},
		set_by: {
			type: String,
			default: null,
		},
		committee: {
			type: Number,
			ref: 'Committee',
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps: { createdAt: false, updatedAt: 'updated_date' },
	}
)

const StatusModel = mongoose.model<IStatus>('Status', statusSchema)

export { StatusModel }
export type { IStatus }
