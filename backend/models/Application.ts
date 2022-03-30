import mongoose from 'mongoose'
import { StatusEnum } from '../utils/enums'

interface IApplication {
	name: string
	phone_number: string
	email: string
	text: string
	submitted_date: Date
	committees: number[]
	statuses: IStatus[]
}

interface IStatus {
	value: string
	setBy: string | null
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
				values: Object.values(StatusEnum),
				message: `{VALUE} is not a supported value. Valid values are ${stringifyEnum(
					StatusEnum
				)}`,
			},
			required: true,
			default: StatusEnum.PENDING,
		},
		setBy: {
			type: String,
			default: null,
		},
		committee: {
			type: Number,
			ref: 'Committee',
			required: true,
		},
	},
	{ _id: false, timestamps: { createdAt: false, updatedAt: 'updated_date' } }
)

const StatusModel = mongoose.model<IStatus>('Status', statusSchema)

const ApplicationModel = mongoose.model<IApplication>(
	'Application',
	new mongoose.Schema<IApplication>(
		{
			name: {
				type: String,
				required: true,
			},
			phone_number: {
				type: String,
				required: true,
			},
			email: {
				type: String,
				required: true,
			},
			text: {
				type: String,
				required: true,
			},
			committees: {
				type: [
					{
						type: Number,
						ref: 'Committee',
						required: true,
					},
				],
				validate: [
					(val: []) => val.length > 0,
					'There must be at least one committee',
				],
			},
			statuses: [statusSchema],
		},
		{ timestamps: { createdAt: 'submitted_date', updatedAt: false } }
	)
)

export { ApplicationModel, StatusModel }
export type { IApplication, IStatus }
