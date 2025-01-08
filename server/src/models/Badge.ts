// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/src/models/Badge.ts
// Description       : The model of the badge.
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '.';


class Badge extends Model {
    public id!: number;
    public badgeName!: string;
    public badgeIcon!: string;
    public badgeColor!: string;
    public padgePoints!: number;
}

Badge.init(
    {
        badgeName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        badgeIcon: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        badgeColor: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        badgePoints: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Badge',
        tableName: 'Badges',
        timestamps: false,
    }
);

export default Badge;
module.exports = Badge;