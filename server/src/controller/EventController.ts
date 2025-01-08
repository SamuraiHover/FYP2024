// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/src/controller/EventController.ts
// Description       : The controller to manage the event.
import { Request, Response } from "express";
const { Event} = require('../models');

module.exports = {
    async eventListRequest(req: Request, res: Response) {
        try {
            const events = await Event.findAll();
            return res.status(200).json(events);
        } catch (error) {
            return res.status(500).json({ error: 'Error fetching events' });
        }
    },
    async eventListCalendarRequest(req: Request, res: Response) {
        try {
            const events = await Event.findAll();
            const eventsCalendar = events.map((event: any) => {
                const endDate = new Date(event.endDate);
                return {
                    id: event.id,
                    title: event.eventName,
                    start: event.startDate,
                    end: endDate.toISOString(),
                    allDay: true
                }
            });
            return res.status(200).json(eventsCalendar);
        } catch (error) {
            return res.status(500).json({ error: 'Error fetching events' });
        }
    },
    async eventDetailsRequest(req: Request, res: Response) {
        try {
            const event = await Event.findByPk(req.body.id);
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }
            return res.status(200).json(event);
        } catch (error) {
            return res.status(500).json({ error: 'Error fetching event' });
        }
    },
    async eventCreate(req: Request, res: Response) {
        try {
            const event = await Event.create(req.body);
            return res.status(201).json({message: 'Event created successfully'});
        } catch (error) {
            return res.status(500).json({ error: 'Error creating event' });
        }
    },
    async eventUpdate(req: Request, res: Response) {
        try {
            const event = await Event.findByPk(req.body.id);
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }
            event.update(req.body);
            return res.status(200).json({message: 'Event updated successfully'});
        } catch (error) {
            return res.status(500).json({ error: 'Error updating event' });
        }
    },
    async eventDelete(req: Request, res: Response) {
        try {
            const event = await Event.findByPk(req.body.id);
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }
            event.destroy();
            return res.status(200).json({message: 'Event deleted successfully'});
        } catch (error) {
            return res.status(500).json({ error: 'Error deleting event' });
        }
    },
}