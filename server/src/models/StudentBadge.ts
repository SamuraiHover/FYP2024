// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/src/models/StudentBadge.ts
// Description       : The model of the student badge join table.
import { DataTypes, Model } from 'sequelize';
import { sequelize } from ".";

class StdudentBadge extends Model{
    studentId!: number;
    badgeId!: number;
    obtainDate!: Date;
}

StdudentBadge.init({
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Students',
            key: 'id'
        }
    },
    badgeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Badges',
            key: 'id'
        }
    },
    obtainDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
},
    {
        sequelize,
        modelName: 'StudentBadge',
        tableName: 'StudentBadge',
        timestamps: false
    }
)

export default StdudentBadge;
module.exports = StdudentBadge;
