// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/src/models/Advisor.ts
// Description       : The model of the advisor.
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '.';


class Advisor extends Model {
    public userId!: number;
    public clubId?: number;
}

Advisor.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        clubId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Clubs',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        modelName: 'Advisor',
        tableName: 'Advisors',
        timestamps: false,
    }
);

export default Advisor;
module.exports = Advisor;