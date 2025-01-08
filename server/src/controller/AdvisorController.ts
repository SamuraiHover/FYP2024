// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/src/controller/AdvisorController.ts
// Description       : The controller to manage the advisor.
import { Request, Response } from "express";
import { Op } from 'sequelize';
const { Club, Advisor, User } = require('../models');

module.exports ={
    async advisorRequest(req: Request, res: Response){
        try{
            const advisor = await Advisor.findOne({

                where: { userId: req.body.userId },
                include: [
                    { model: User, attributes: {exclude: ['password'] }},
                    { model: Club }
                ]
            });  
            res.send(advisor);
        } catch(err){
            console.log(err);
            res.status(500).send({
                error: 'An error has occured trying to fetch the club list'
            });
        }
    },
    async nonClubAdvisorListRequest(req: Request, res: Response){
        try{
            const advisorList = await Advisor.findAll(
                {
                    include: [
                        {
                            model: User,
                            attributes: {exclude: ['password']}
                        }
                    ],
                    where: { clubId: null }
                }
            );
            console.log("server:" + advisorList);
            return res.send(advisorList);
            
        } catch(err){
            console.log(err);
            res.status(500).send({
                error: 'An error has occured trying to fetch the club list'
            });
        }
    },
    async clubAdvisorListRequest(req: Request, res: Response){
        try{
            const advisorList = await Advisor.findAll(
                {
                    include: [
                        {
                            model: User,
                            attributes: {exclude: ['password']}
                        }
                    ],
                    where: { clubId: { [Op.ne]: null } }
                }
            );
            console.log("server:" + advisorList);
            return res.send(advisorList);
            
        } catch(err){
            console.log(err);
            res.status(500).send({
                error: 'An error has occured trying to fetch the club list'
            });
        }
    },
    async advisorListRequest(req: Request, res: Response) {
        try {
            const advisorList = await Advisor.findAll(
                {
                    include: [
                        {
                            model: User,
                            attributes: { exclude: ['password'] }
                        },
                        {
                            model: Club
                        }
                    ]
                }
            );
            return res.send(advisorList);
        } catch (err) {
            console.log(err);
            res.status(500).send({
                error: 'An error has occured trying to fetch the club list'
            });
        }
    }
}