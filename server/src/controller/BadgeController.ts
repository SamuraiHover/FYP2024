// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/src/controller/BadgeController.ts
// Description       : The contreoller to manage the badge.
import { Request, Response } from "express";

const { Badge, StudentBadge } = require('../models');

module.exports = {
    async badgeListRequest(req: Request, res: Response) {
        try {
            const badgeList = await Badge.findAll();
            return res.status(200).send(badgeList);
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                error: 'An error has occured trying to fetch the badge list'
            });
        }
    },
    async badgeCreate(req: Request, res: Response) {
        try {
                const badgeInfo = await Badge.create(req.body);
                return res.status(200).send({
                    message: 'Badge created successfully',
                });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                error: 'An error has occured trying to create the club'
            });
        }
    },
    async badgeUpdate(req: Request, res: Response) {
        try {
            const badgeInfo = await Badge.update(req.body, {
                where: {
                    id: req.body.id
                }
            });
            return res.status(200).send({
                message: 'Badge updated successfully',
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                error: 'An error has occured trying to update the badge'
            });
        }
    },
    async badgeDelete(req: Request, res: Response) {
        try {
            const badgeInfo = await Badge.destroy({
                where: {
                    id: req.body.id
                }
            });
            return res.status(200).send({
                message: 'Badge deleted successfully',
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                error: 'An error has occured trying to delete the badge'
            });
        }
    },
    async badgeAssign(req: Request, res: Response) {
        try {
            await StudentBadge.create({
                studentId: req.body.studentId,
                badgeId: req.body.badgeId,
                obtainDate: new Date()
            });
            return res.status(200).json({
                message: 'Badge assigned successfully',
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                error: 'An error has occured trying to assign the badge'
            });
        }
    },
    async badgeUnassign(req: Request, res: Response) {
        try {
            await StudentBadge.destroy({
                where: {
                    studentId: req.body.studentId,
                    badgeId: req.body.badgeId
                }
            });
            return res.status(200).json({
                message: 'Badge unassigned successfully',
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                error: 'An error has occured trying to unassign the badge'
            });
        }
    }
}