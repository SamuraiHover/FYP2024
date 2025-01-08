// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/src/controller/StudentController.ts
// Description       : The controller to manage the student.
import { Request, Response } from "express";
import { Op } from "sequelize";

const {User, Student, StudentBadge, Club  } = require('../models');

module.exports = {
    async studentRequest(req: Request, res: Response){
        try{
            const student = await Student.findOne({

                where: { userId: req.body.userId },
                include: [
                    { model: User, attributes: {exclude: ['password'] }},
                    { model: StudentBadge, include: { all: true } },
                    { model: Club }
                ]
            });  
            res.send(student);
        } catch(err){
            console.log(err);
            res.status(500).send({
                error: 'An error has occured trying to fetch the club list'
            });
        }
    },
    async nonClubStudentsRequest(req: Request, res: Response){
        try{
            const studentList = await Student.findAll(
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
            console.log("server:" + studentList);
            res.send(studentList);
            
        } catch(err){
            console.log(err);
            res.status(500).send({
                error: 'An error has occured trying to fetch the club list'
            });
        }
    },
    async studentListRequest(req: Request, res: Response){
        try{
            const studentList = await Student.findAll(
                {
                    include: [
                        {
                            model: User,
                            attributes: {exclude: ['password']}
                        },
                        {
                            model: Club
                        }
                    ]
                }
            );
            console.log("server:" + studentList);
            res.send(studentList);
            
        } catch(err){
            console.log(err);
            res.status(500).send({
                error: 'An error has occured trying to fetch the club list'
            });
        }
    },
    async studentBadgeAssignedListRequest(req: Request, res: Response){
        try{
            const studentList = await Student.findAll(
                {
                    include: [
                        {
                            model: StudentBadge,
                            where: { badgeId: req.body.badgeId }
                        },
                        {
                            model: User,
                            attributes: {exclude: ['password']}
                        },
                        {
                            model: Club,
                        }
                    ]
                }
            );
            console.log("server:" + studentList);
            res.status(200).send(studentList);
            
        } catch(err){
            console.log(err);
            res.status(500).json({
                error: 'An error has occured trying to fetch the student list'
            });
        }
    },
    async studentBadgeUnassignedListRequest(req: Request, res: Response){
        try{
            const filterStudents = await StudentBadge.findAll(
                {
                    where: { badgeId: req.body.badgeId },
                    attributes: ['studentId']
                }
            );
            const filteredIds = filterStudents.map((student: any) => student.studentId);
            const studentList = await Student.findAll(
                {
                    where: {
                        id: { [Op.notIn]: filteredIds }
                    },
                    include: [
                        {
                            model: User,
                            attributes: {exclude: ['password']}
                        },
                        {
                            model: Club,
                        }
                    ]
                }
            );
            console.log("server:" + studentList);
            res.status(200).send(studentList);
            
        } catch(err){
            console.log(err);
            res.status(500).json({
                error: 'An error has occured trying to fetch the student list'
            });
        }
    },
    
}