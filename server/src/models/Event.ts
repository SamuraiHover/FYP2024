// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/src/models/Event.ts
// Description       : The model of the event.
import { DataTypes, Model } from 'sequelize';
import { sequelize } from ".";

class Event extends Model {
    id!: number;
    eventName!: string;
    eventDescription!: Text;
    startDate!: Date;
    endDate!: Date;
    startTime!: Date;
    endTime!: Date;
}

Event.init({
    eventName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eventDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false
    }
},
    {
        sequelize,
        modelName: 'Event',
        tableName: 'Events',
        timestamps: false
    }
)

export default Event;
module.exports = Event;