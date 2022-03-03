import mongoose from 'mongoose'

interface IApplication {
	name: string
	phone_number: string
	email: string
	text: string
	submitted_date: Date
	committees: number[]
}

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
		},
		{ timestamps: { createdAt: 'submitted_date', updatedAt: false } }
	)
)

export { ApplicationModel }
export type { IApplication }
