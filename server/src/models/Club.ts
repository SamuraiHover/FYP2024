// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/src/models/Club.ts
// Description       : The model of the club.

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '.';


class Club extends Model {
    clubName!: string;
    clubDescription!: string;
    committeeNo!: number;
    activityDay!: string;
    activityStartTime!: Date;
    activityEndTime!: Date;
}

Club.init(
    {
        clubName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        clubDescription: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        committeeNo: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        activityDay: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        activityStartTime: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        activityEndTime: {
            type: DataTypes.TIME,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Club',
        tableName: 'Clubs',
        timestamps: false,
    }
);

module.exports = Club;
export default Club;