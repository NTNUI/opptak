import { NextFunction, Request, Response } from 'express'
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken'
import {
	getRoleInGroup,
	getNtnuiToken,
	isValidNtnuiToken,
	refreshNtnuiToken,
} from 'ntnui-tools'
import { CustomError, UnauthorizedUser } from 'ntnui-tools/customError'
import { CommitteeModel } from '../models/Committee'
import MembershipType from '../utils/enums'
import { IRoleInCommittee, UserModel } from '../models/User'

async function updateOrCreateUserModel(
	ntnui_no: number,
	rolesInCommittees: IRoleInCommittee[]
) {
	return UserModel.updateOne(
		{ _id: ntnui_no },
		{
			_id: ntnui_no,
			committees: rolesInCommittees,
		},
		{
			upsert: true,
			runValidators: true,
		}
	).catch((err) => {
		throw new CustomError(
			`Could not update or create user model.`,
			500,
			`${err.message}`
		)
	})
}

async function getCommittees() {
	return CommitteeModel.find()
		.then((committees) => committees)
		.catch(() => {
			throw new CustomError('Could not get committees from local db', 500)
		})
}

function isRoleInAccessRoles(role: string, access_roles: string[]) {
	if (role && (role === MembershipType.leader || access_roles.includes(role))) {
		return true
	}
	return false
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
	try {
		if (!req.body.refresh) {
			return res.status(403).json({ error: 'No refresh-token sent!' })
		}
		const token = req.body.refresh
		const tokens = await refreshNtnuiToken(token)
		if (tokens) {
			return res.status(200).json({ access: tokens.access })
		}
		return res.status(401).json({ error: 'Token is invalid or expired' })
	} catch (error) {
		return next(error)
	}
}

export async function verify(req: Request, res: Response) {
	if (!req.body.token) {
		return res.status(403).json({ error: 'No token sent!' })
	}
	const { token } = req.body
	const isValidToken = await isValidNtnuiToken(token)
	if (isValidToken) {
		return res.status(200).json({ message: 'Token is valid' })
	}
	return res.status(401).json({ error: 'Token is invalid or expired' })
}

export async function login(req: Request, res: Response, next: NextFunction) {
	// 1. Send request to NTNUI and retrieve tokens
	// 2. Decode token and get ntnui_no
	// 3. Check users role in each committee in NTNUI membership system
	// 		- Get all committees from local db
	//   	- For each committee, check role in group in NTNUI membership system by slug
	//		- Determine if role is in access roles of local committees OR is leader
	// 			* If yes, push to array of role in committee
	//		- Update user model in local database with roles in committees
	// 4. If role in committees is empty, unauthorized user

	try {
		// Use package to get tokens
		const tokens = await getNtnuiToken(req.body.phone_number, req.body.password)
		// Get ntnui_no
		const decodedToken: JwtPayload | null | string = jsonwebtoken.decode(
			tokens.access
		)
		if (decodedToken && typeof decodedToken !== 'string') {
			// Get all committees from local db
			const committees = await getCommittees()
			// Get what role user has in every committees
			const rolesResults = committees.map((committee) =>
				getRoleInGroup(committee.slug, tokens.access)
			)
			const roles = await Promise.all(rolesResults)
			// Get role in committees
			const rolesInCommittees: IRoleInCommittee[] = []
			for (let roleIdx = 0; roleIdx < roles.length; roleIdx += 1) {
				const committee = committees[roleIdx]
				const role = roles[roleIdx]
				if (role && isRoleInAccessRoles(role, committee.access_roles)) {
					rolesInCommittees.push({
						committee: committee._id,
						role,
					})
				}
			}
			const ntnuiNo = decodedToken.ntnui_no
			if (rolesInCommittees.length) {
				await updateOrCreateUserModel(ntnuiNo, rolesInCommittees)
				return res
					.status(200)
					.json({ access: tokens.access, refresh: tokens.refresh })
			}
		}
		throw UnauthorizedUser
	} catch (error) {
		return next(error)
	}
}
