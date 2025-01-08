// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/src/models/User.ts
// Description       : The model of the user.
import {DataTypes, Model, Optional, Sequelize} from "sequelize";
import { sequelize } from ".";
const bcrypt = require('bcrypt');


class User extends Model {
    email!: string;
    name!: string;
    password!: string;
    gender!: string;
    role!: string;

    comparePassword!: (password: string) => Promise<boolean>;
}



User.init({
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    hooks: {
        beforeCreate: hashPassword,
        beforeUpdate: hashPassword
    },
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: false
});

User.prototype.comparePassword = function (password: string) {
    console.log(password);
    console.log(this.password);
    return bcrypt.compare(password, this.getDataValue('password'));
};

module.exports = User;
export default User;

function hashPassword(user: any, options: any) {
    console.log("Hashing begins");
    const SALT_FACTOR = 8;
    if (!user.changed('password')) {
        return;
    }

    console.log("return hash");
    return bcrypt
        .genSalt(SALT_FACTOR)
        .then((salt: String) => bcrypt.hash(user.password, salt, null))
        .then((hash: String) => {
            user.setDataValue('password', hash);
        });
}