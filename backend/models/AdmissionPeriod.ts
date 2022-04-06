import mongoose from 'mongoose'

// Since only the "date-part" of the date is used, not the "clocktime-part"
// it's easier to handle it as a string, and not a Date, since mongoose
// will then add a clocktime-part aswell
interface IAdmissionPeriod {
	start_date: string
	end_date: string
}

const AdmissionPeriodModel = mongoose.model<IAdmissionPeriod>(
	'AdmissionPeriod',
	new mongoose.Schema<IAdmissionPeriod>(
		{
			start_date: { type: String, required: true },
			end_date: { type: String, required: true },
		},
		{ collection: 'admissionperiod' }
	)
)

export { AdmissionPeriodModel }
export type { IAdmissionPeriod }
