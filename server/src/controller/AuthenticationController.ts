// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/src/controller/AuthenticationController.ts
// Description       : TThe controller to manage the authentication of the user.
import { Request, Response } from "express";
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User, Advisor, Student } = require('../models');
const MailController = require('./MailController');

function jwtSignUser(user: any) {
	const ONE_WEEK = 60 * 60 * 24 * 7;
	return jwt.sign(user, config.authentication.jwtSecret, {
		expiresIn: ONE_WEEK
	});
}


module.exports = {
	async register(req: Request, res: Response) {
		try {

			console.log(User);
			if (req.body.name == '' || req.body.email == '' || req.body.password == '') {
				res.status(400).send({
					error: 'Please fill in all fields'
				});
			}

			if (req.body.role === 'Advisor') {
				const user = await User.create({
					...req.body,
					Advisor: {}
				},
					{ include: [Advisor] }
				);
				MailController.sendAccountCreated(req.body.email, req.body.password);
				res.status(201).send(user.toJSON());
			} else if (req.body.role === 'Student') {
				const existingUser = await Student.findOne({ where: { tpNum: req.body.tpNum } });
				if (existingUser) {
					res.status(400).send({
						error: 'TP Number already exists'
					});
				} else {
					const user = await User.create(
						{
							...req.body,
							Student: {
								tpNum: req.body.tpNum,
								isCommittee: false
							}
						},
						{ include: [Student] }
					);
					res.status(201).send(user.toJSON());
				}
			}
			else {
				res.status(400).send({
					error: 'No role specified'
				});
			}

		} catch (err) {
			console.log(err);
			res.status(400).send({
				error: 'This email account is already in use.'
			});
		}
	},
	async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({
				where: {
					email: email
				}
			});
			if (!user) {
				return res.status(403).send({
					error: 'Incorrect login information'
				});
			}
			console.log(password);
			const isPasswordValid = await user.comparePassword(password);
			console.log(isPasswordValid);
			if (!isPasswordValid) {
				return res.status(403).send({
					error: 'Incorrect login password'
				});
			}

			const userJson = user.toJSON();
			res.send({
				user: userJson,
				token: jwtSignUser(userJson)
			});
		} catch (err) {
			res.status(500).send({
				error: 'An error has occured trying to log in'
			});
		}
	},
	async getUser(req: Request, res: Response) {
		try {
			const { id } = req.body;
			const user = await User.findByPk(id);
			res.status(200).send(user);
		} catch (err) {
			res.status(500).send({
				error: 'An error has occured trying to get user'
			});
		}
	},
	async updateUser(req: Request, res: Response) {
		try {
			const user = await User.update(req.body,
				{
					where: {
						id: req.body.id
					}
				}
			);
			res.status(200).send({
				message: "Profile updated"
			});
		}
		catch (err) {
			console.log(err)
			res.status(500).send({
				error: 'An error has occured trying to update user'
			});
		}
	},
	async updatePassword(req: Request, res: Response) {
		try {
            const user = await User.findByPk(req.body.id);
            const isPasswordValid = await user.comparePassword(req.body.oldPassword);
            console.log(isPasswordValid)
            if (!isPasswordValid) {
                return res.status(403).send({
                    error: 'Incorrect password'
                });
            }
            await user.update({password: req.body.newPassword});
			res.status(200).send({
				message: "Password updated"
			});
		}
		catch (err) {
			console.log(err)
			res.status(500).send({
				error: 'An error has occured trying to update password'
			});
		}
	}
}