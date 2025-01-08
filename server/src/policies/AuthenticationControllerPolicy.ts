// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/src/policies/AuthenticationControllerPolicy.ts
// Description       : The policy of the authentication controller.
import { Request, Response, NextFunction } from 'express';

const Joi = require('joi');

module.exports = {
    register(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            email: Joi.string().email(),
            password: Joi.string().regex(new RegExp('^[a-zA-Z0-9]{3,30}$')),
            name: Joi.string(),
            role: Joi.string(),
            gender: Joi.string().valid('Male', 'Female'),
            tpNum: Joi.string().optional(),
        });
        const { error, value } = schema.validate(req.body);
        if (error) {
            console.log(error);
            switch (error.details[0].context.key) {
                case 'name':
                    res.status(400).send({
                        error: 'You must provide a name'
                    });
                    break;
                case 'gender':
                    res.status(400).send({
                        error: 'You must select a gender'
                    });
                case 'email':
                    res.status(400).send({
                        error: 'You must provide a valid email address'
                    });
                    break;
                case 'password':
                    res.status(400).send({
                        error: `The password provided failed to match the following rules:
                        <br>
                        1. It must contain ONLY the following characters: lower case, upper case, numerics.
                        <br>
                        2. It must be at least 3 characters in length and not greater than 30 characters in length.`
                    });
                    break;
                default:
                    res.status(400).send({
                        error: 'This is not supposed to happen!!!! Check AuthenticationControllerPolicy.ts'
                    });
            }
        }
        else {
            next();
        }
    },
    updateUser(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            id: Joi.number(),
            email: Joi.string().email(),
            name: Joi.string(),
            gender: Joi.string().valid('Male', 'Female'),
        });
        const { error, value } = schema.validate(req.body);
        if (error) {
            console.log(error);
            switch (error.details[0].context.key) {
                case 'name':
                    res.status(400).send({
                        error: 'You must provide a name'
                    });
                    break;
                case 'gender':
                    res.status(400).send({
                        error: 'You must select a gender'
                    });
                case 'email':
                    res.status(400).send({
                        error: 'You must provide a valid email address'
                    });
                    break;
                default:
                    res.status(400).send({
                        error: 'This is not supposed to happen!!!! Check AuthenticationControllerPolicy.ts'
                    });
            }
        }
        else {
            next();
        }
    } 
}