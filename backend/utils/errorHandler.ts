import { Request, Response, NextFunction } from 'express'
import { CustomError } from 'ntnui-tools/customError'

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
	console.log(`Halloo ${err}`)
	
	if (!(err instanceof CustomError)) {
		customError = new CustomError(
			'Oh no, something went wrong that we did not handle'
		)
	}
	

	return res.status((customError as CustomError).status).send(customError)
}

export default handleError
