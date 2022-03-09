export class CustomError extends Error {
	message!: string

	status!: number

	additionalInfo!: any

	constructor(message: string, status: number = 500, additionalInfo: any = {}) {
		super()
		this.message = message
		this.status = status
		this.additionalInfo = additionalInfo
		Object.setPrototypeOf(this, CustomError.prototype)
	}
}

export const UnauthorizedUserError: CustomError = new CustomError(
	'Unauthorized user',
	401
)
export const BadRequestError: CustomError = new CustomError('Bad request', 400)
