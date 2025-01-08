// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/src/controller/FormApplicationController.ts
// Description       : The controller to manage the form application.
import { Request, Response } from "express";
const { FormApplication, Student, Advisor, User, Club } = require('../models');

module.exports = {
    async formApplicationListRequest(req: Request, res: Response) {
        try {
            const formApplications = await FormApplication.findAll({
                where: {
                    status: req.body.status
                    
                },
                include:[{model: User, attributes: ['name']},{model: Club, attributes: ['clubName']}]
            });
            return res.status(200).json(formApplications);
        } catch (error) {
            return res.status(500).json({ error: 'Error fetching form applications' });
        }
    },
    async formApplicationListRequestUser(req: Request, res: Response) {
        try {
            const formApplications = await FormApplication.findAll({
                where: {
                    userId: req.body.userId,
                    clubId: null
                },
                include:[{model: User, attributes: ['name']},{model: Club, attributes: ['clubName']}]
            });
            return res.status(200).json(formApplications);
        } catch (error) {
            return res.status(500).json({ error: 'Error fetching form applications' });
        }
    },
    async formApplicationListRequestClub(req: Request, res: Response) {
        try {
            if(req.body.role == 'Student') {
                const user = await Student.findOne({
                    where: {
                        userId: req.body.userId,
                        isCommittee: true
                    }
                });
                const formApplications = await FormApplication.findAll({
                    where: {
                        clubId: user.clubId,
                    },
                    include:[{model: User, attributes: ['name']},{model: Club, attributes: ['clubName']}]
                });
                return res.status(200).json(formApplications);
            }
            else{
                const user = await Advisor.findOne({
                    where: {
                        userId: req.body.userId
                    }
                });
                if(!user.clubId) return res.status(500).json({ error: 'Advisor not assigned to any club' });
                const formApplications = await FormApplication.findAll({
                    where: {
                        clubId: user.clubId,
                    },
                    include:[{model: User, attributes: ['name']},{model: Club, attributes: ['clubName']}]
                });
                return res.status(200).json(formApplications);
            }
        } catch (error) {
            return res.status(500).json({ error: 'Error fetching form applications' });
        }
    },
    async formApplicationCreate(req: Request, res: Response) {
        try {
            console.log(req.body)
            if (!req.body.clubId) {
                const formApplication = await FormApplication.create({
                    ...req.body,
                    status: 'Pending',
                    lastUpdated: new Date()
    
                });
                return res.status(200).json({message: 'Form application created successfully'});
            }
            else{
                const formApplication = await FormApplication.create({
                    ...req.body,
                    status: 'PendingAdvisor',
                    lastUpdated: new Date(),
                    clubId: req.body.clubId
                });
                return res.status(200).json({message: 'Form application created successfully'});
            }
        } catch (error) {
            return res.status(500).json({ error: 'Error creating form application' });
        }
    },
    async formApplicationDelete(req: Request, res: Response) {
        try {
            const formApplication = await FormApplication.findByPk(req.body.id);
            if (!formApplication) {
                return res.status(404).json({ error: 'Form application not found' });
            }
            formApplication.destroy();
            return res.status(200).json({message: 'Form application deleted successfully'});
        } catch (error) {
            return res.status(500).json({ error: 'Error deleting form application' });
        }
    },
    async formApplicationUpdate(req: Request, res: Response) {
        try {
            const formApplication = await FormApplication.findByPk(req.body.id);
            if (!formApplication) {
                return res.status(404).json({ error: 'Form application not found' });
            }
            formApplication.update({
                ...req.body,
                lastUpdated: new Date()
            });
            return res.status(200).json({message: 'Form application updated successfully'});
        } catch (error) {
            return res.status(500).json({ error: 'Error updating form application' });
        }
    },
}