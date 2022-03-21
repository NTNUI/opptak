import mongoose from 'mongoose'

interface IApplicationPeriod {
	start_date: Date
	end_date: Date
}

const ApplicationPeriodModel = mongoose.model<IApplicationPeriod>(
	'ApplicationPeriod',
	new mongoose.Schema<IApplicationPeriod>({
		start_date: { type: Date, required: true },
		end_date: { type: Date, required: true },
	})
)

export { ApplicationPeriodModel }
export type { IApplicationPeriod }
