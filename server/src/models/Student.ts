// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/src/models/Student.ts
// Description       : The model of the student.

import { DataTypes, Model } from 'sequelize';
import { sequelize } from ".";


class Student extends Model {

    public id!: number;
    public tpNum!: string;
    public userId!: number;
    public clubId?: number;
    public isCommittee!: boolean;

    // Add any additional fields or methods here

    // Define the model attributes

}

Student.init({
    tpNum: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // 'User' should be the name of your User table in the database
            key: 'id',
        },
    },
    clubId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Clubs', // 'Club' should be the name of your Club table in the database
            key: 'id',
        },
    },
    isCommittee: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
},
    {
        sequelize,
        modelName: 'Student',
        tableName: 'Students',
        timestamps: false
    }
);


export default Student;
module.exports = Student;