import mongoose from 'mongoose'

interface IAdmissionPeriod {
	start_date: Date
	end_date: Date
}

const AdmissionPeriodModel = mongoose.model<IAdmissionPeriod>(
	'AdmissionPeriod',
	new mongoose.Schema<IAdmissionPeriod>(
		{
			start_date: { type: Date, required: true },
			end_date: { type: Date, required: true },
		},
		{ collection: 'admissionperiod' }
	)
)

export { AdmissionPeriodModel }
export type { IAdmissionPeriod }
