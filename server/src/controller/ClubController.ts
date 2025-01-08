// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/src/controller/ClubController.ts
// Description       : The controller to manage the club.
import { Request, Response } from "express";


import { Op } from 'sequelize';
const { Club, Advisor, User, Student } = require('../models');

module.exports = {
    async clubListRequest(req: Request, res: Response) {
        try {
            const clubList = await Club.findAll(
                {
                    include: [
                        {
                            model: Advisor,
                            include: [
                                {
                                    model: User,
                                    attributes: { exclude: ['password'] }
                                }
                            ]
                        }
                    ]
                }
            );
            res.send(clubList);
        } catch (err) {
            console.log(err);
            res.status(500).send({
                error: 'An error has occured trying to fetch the club list'
            });
        }
    },

    async clubStudentListRequest(req: Request, res: Response) {
        try {
            const studentList = await Student.findAll(
                {
                    include: [
                        {
                            model: User,
                            attributes: { exclude: ['password'] }
                        },
                        {
                            model: Club
                        }
                    ],
                    where: { clubId: req.body.clubId }
                }
            );
            res.send(studentList);
        } catch (err) {
            console.log(err);
            res.status(500).send({
                error: 'An error has occured trying to fetch the club list'
            });
        }
    },

    async clubCommitteeListRequest(req: Request, res: Response) {
        try {
            const studentList = await Student.findAll(
                {
                    include: [
                        {
                            model: User,
                            attributes: { exclude: ['password'] }
                        },
                        {
                            model: Club
                        }
                    ],
                    where: {
                        clubId: req.body.clubId,
                        isCommittee: true
                    }
                }
            );
            res.send(studentList);
        } catch (err) {
            console.log(err);
            res.status(500).send({
                error: 'An error has occured trying to fetch the club list'
            });
        }
    },

    async removeStudentFromClub(req: Request, res: Response) {
        try {
            const removeStudent = await Student.update(
                {
                    isCommittee: false,
                    clubId: null
                },
                { where: { id: req.body.id } }
            );
            res.send({
                message: 'Club info deleted'
            })
        } catch (err) {
            console.log(err);
            res.status(500).send({
                error: 'An error has occured trying to delete the club info'
            });
        }
    },

    async addStudentToClub(req: Request, res: Response) {
        try {
            const addStudent = await Student.update(
                {
                    clubId: req.body.clubId
                },
                { where: { id: req.body.id } }
            );
            res.send({
                message: 'Student added to club'
            })
        } catch (err) {
            console.log(err);
            res.status(500).send({
                error: 'An error has occured trying to add the student to the club'
            });
        }
    },

    async addStudentToCommittee(req: Request, res: Response) {

        try {
            const student = await Student.findOne({
                where: { id: req.body.id }
            });
            console.log("server: " + student);

            if (student && student.isCommittee == true) {
                return res.send({
                    message: 'Student is already in a committee'
                });
            } else {
                const club = await Club.findOne({
                    where: { id: req.body.clubId }
                });

                const committeeCount = await Student.count({
                    where: {
                        isCommittee: true,
                        clubId: {
                            [Op.eq]: req.body.clubId
                        }
                    }
                });

                if (committeeCount >= club.committeeNo) {
                    return res.send({
                        message: 'Committee is full'
                    });
                }
                else {
                    const addStudent = await Student.update(
                        {
                            isCommittee: true
                        },
                        { where: { id: req.body.id } }
                    );
                    return res.send({
                        message: 'Student added to committee'
                    })
                }
            }
        } catch (err) {
            console.log(err);
            res.status(500).send({
                error: 'An error has occured trying to add the student to the committee'
            });
        }
    },

    async removeStudentFromCommittee(req: Request, res: Response) {
        try {
            const removeStudent = await Student.update(
                {
                    isCommittee: false
                },
                { where: { id: req.body.id } }
            );
            res.send({
                message: 'Student removed from committee'
            })
        } catch (err) {
            console.log(err);
            res.status(500).send({
                error: 'An error has occured trying to remove the student from the committee'
            });
        }
    },

    async nonMemberRequest(req: Request, res: Response) {
        try {
            const nonMemberList = await Student.findAll(
                {
                    include: [
                        {
                            model: User,
                            attributes: { exclude: ['password'] }
                        }
                    ],
                    where: { clubId: null }
                }
            );
            res.send(nonMemberList);
        } catch (err) {
            console.log(err);
            res.status(500).send({
                error: 'An error has occured trying to fetch the student list'
            });
        }
    },

    async clubInfoDelete(req: Request, res: Response) {
        console.log(req.body);
        try {
            const clubInfo = await Club.destroy({ where: { id: req.body.id } });
            const studentInfo = await Student.update(
                {
                    isCommittee: false,
                },
                { where: { clubId: null,
                        isCommittee: true} 
                    }
            );
            res.send({
                message: 'Club info deleted'
            })
        } catch (err) {
            console.log(err);
            res.status(500).send({
                error: 'An error has occured trying to delete the club info'
            });
        }
    },

    async clubInfoUpdate(req: Request, res: Response) {

        //Check Committee Number
        try {
            const committeeCount = await Student.count({
                where: {
                    isCommittee: true,
                    clubId: {
                        [Op.eq]: req.body.id
                    }
                }
            });

            if (committeeCount > req.body.committeeNo) {
                return res.status(500).send({
                    error: 'Committee number is less than the number of students in the committee. Please remove students from the committee first.'
                });
            }
        }catch(err){
            console.log(err);
            return res.status(500).send({
                error: 'An error has occured trying to update the club info'
            });
        }

        try {
            const clubInfo = await Club.update(
                {
                    clubName: req.body.clubName,
                    clubDescription: req.body.clubDescription,
                    advisorId: req.body.advisorId,
                    committeeNo: req.body.committeeNo,
                    activityDay: req.body.activityDay,
                    activityStartTime: req.body.activityStartTime,
                    activityEndTime: req.body.activityEndTime
                },
                { where: { id: req.body.id } }
            );
            const removeAdvisorClubLink = await Advisor.update(
                {
                    clubId: null
                },
                { where: { clubId: req.body.id } }
            );
            const updateAdvisorInfo = await Advisor.update(
                {
                    clubId: req.body.id
                },
                { where: { id: req.body.Advisor.id } }
            );
            return res.send({
                message: 'Club info updated'
            })
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                error: 'An error has occured trying to update the club info'
            });
        }
    },

    async clubCreate(req: Request, res: Response) {
        try {
                const clubInfo = await Club.create(req.body);
                const advisorInfo = await Advisor.update(
                    {
                        clubId: clubInfo.id
                    },
                    { where: { id: req.body.advisorId } }
                );
                return res.send({
                    message: 'Club created'
                })
            
        } catch (err) {
            console.log(err);
            res.status(500).send({
                error: 'An error has occured trying to create the club'
            });
        }
    },
    
    async clubInfoRequest(req: Request, res: Response){
        try {
            console.log("Server : "+  req.body)
            if (req.body.role == "Advisor") {
                const clubWithAdvisor = await Club.findOne(
                    {
                        include: [
                            {
                                model: Advisor,
                                where: { userId: req.body.id },
                            },
                        ],
                    }
                );
                if (!clubWithAdvisor) {
                    return res.status(404).send({ message: 'Club not found' });
                }
                return res.send(clubWithAdvisor);
            }
            else if(req.body.role == "Student"){
                const clubWithStudent = await Club.findOne(
                    {
                        include: [
                            {
                                model: Student,
                                where: { userId: req.body.id },
                            },
                        ],
                    }
                );
                if (!clubWithStudent) {
                    return res.status(404).send({ message: 'Club not found' });
                }
                return res.send({
                    id: clubWithStudent.id,
                    clubName: clubWithStudent.clubName,
                    clubDescription: clubWithStudent.clubDescription,
                    committeeNo: clubWithStudent.committeeNo,
                    activityDay: clubWithStudent.activityDay,
                    activityStartTime: clubWithStudent.activityStartTime,
                    activityEndTime: clubWithStudent.activityEndTime
                });
            } 
            return res.status(404).send({ message: 'Something is worng' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                error: 'An error has occured trying to fetch the club info'
            });
        }
    }
}