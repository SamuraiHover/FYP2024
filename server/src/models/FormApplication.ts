// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/src/models/FormApplication.ts
// Description       : The model of the form application.
import { DataTypes, Model } from 'sequelize';
import { sequelize } from ".";

class FormApplication extends Model {
    id!: number;
    formName!: string;
    formData!: string;
    status!: string;
    lastUpdated!: Date;
    userId!: number;
    clubId?: number;
}

FormApplication.init({
    formName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    formData: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastUpdated: {
        type: DataTypes.DATE,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    clubId:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Clubs',
            key: 'id'
        }
    },
},
    {
        sequelize,
        modelName: 'FormApplication',
        tableName: 'FormApplications',
        timestamps: false
    }
)

export default FormApplication;
module.exports = FormApplication;