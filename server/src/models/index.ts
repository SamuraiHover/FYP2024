// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/src/models/index.ts
// Description       : The index of that contains all the models and where the sequelize is initialized.

import { Sequelize, DataTypes } from 'sequelize';
const config = require('../config/config');
const db: { [key: string]: any } = {};

const sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    config.db.options
);

const models_User = require('./User');
db['User'] = models_User;

const models_Student = require('./Student');
db['Student'] = models_Student;

const models_Advisor = require('./Advisor');
db['Advisor'] = models_Advisor;

const models_Club = require('./Club');
db['Club'] = models_Club;

const models_Post = require('./Post');
db['Post'] = models_Post;

const models_PostLiked = require('./PostLiked');
db['PostLiked'] = models_PostLiked;

const models_Badge = require('./Badge');
db['Badge'] = models_Badge;

const models_StudentBadge = require('./StudentBadge');
db['StudentBadge'] = models_StudentBadge;

const models_Event = require('./Event');
db['Event'] = models_Event;

const models_FormApplication = require('./FormApplication');
db['FormApplication'] = models_FormApplication;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

require ('./associations');


export { Sequelize, sequelize };
module.exports = db;