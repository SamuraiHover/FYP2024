// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/app.ts
// Description       : The main entry point of the server.
import express, { Express, Request, Response } from "express";

const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const {sequelize} = require('./src/models');
const config = require('./src/config/config');
const { User } = require('./src/models');
const { Student } = require('./src/models');
const { Students } = require('./src/models');
const MailController = require('./src/controller/MailController');
const schedule = require('node-schedule');

const app: Express = express();

//folder for static resources
app.use(express.static(path.join(__dirname, 'src', 'view')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json()).use(cors()).use(morgan('combined'));
require('./src/routes')(app);



//{force:true} will drop the table if it exists and create a new one
sequelize.sync().then(async () => {
  const job = schedule.scheduleJob('0 4 13 * *', function(){
    MailController.sendCocurricularReminder();
  });
  const [admin, created] = await User.findOrCreate({
    where: { role: 'Admin' },
    defaults: {
      // set the default properties if the admin user needs to be created
      name: 'Admin',
      email: 'admin@mail.com',
      gender: 'Male',
      password: 'admin',
    },
  });

  app.listen(config.port, () => {
    console.log(`[server]: Server is running at http://localhost:${config.port}`);
  });
});
