import { Request, Response, NextFunction } from 'express'

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

export const UnauthorizedUser: CustomError = new CustomError(
	'Unauthorized user',
	401
)
export const BadRequest: CustomError = new CustomError('Bad request', 400)

/**
 * Custom error handler to standardize error objects returned to
 * the client
 *
 * @param err Error caught by Express.js
 * @param req Request object provided by Express
 * @param res Response object provided by Express
 * @param next NextFunction function provided by Express
 */
function handleError(
	err: TypeError | CustomError,
	req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	next: NextFunction
) {
	let customError = err

	console.log(err)
	if (!(err instanceof CustomError)) {
		customError = new CustomError(
			'Oh no, something went wrong that we did not handle'
		)
	}

	res.status((customError as CustomError).status).send(customError)
}

export default handleError
