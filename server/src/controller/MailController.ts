// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/src/controller/MailController.ts
// Description       : The controller to manage the mail.
const {Club, Advisor, Student, User} = require('../models');

const nodemailer = require("nodemailer");
import moment from 'moment';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "smrchong28@gmail.com",
      pass: "fjwckezzgaqylgah",
    },
  });

module.exports = {
    async sendCocurricularReminder() {
        const clubs = await Club.findAll(); // Fetch all clubs

        const today = moment().startOf('day'); // Get today's date at the start of the day

        clubs.forEach(async (club:any) => {
            const activityDay = club.activityDay;
            // Calculate the next occurrence of the activity day
            
            let nextActivityDay = moment().day(activityDay).startOf('day');
            console.log(nextActivityDay)
            if (nextActivityDay.isBefore(today)) {
                nextActivityDay.add(1, 'week');
            }

            console.log(today)

            // Check if the next occurrence is one day before today
            if (nextActivityDay.subtract(1, 'day').isSame(today)) {
                // Send reminder email
                const advisor = await Advisor.findOne({
                    include: [
                        { model: User, attributes: { exclude: ['password'] } },
                        { model: Club, where: { id: club.id } }
                    ]
                });
                console.log(advisor.User.email)
                const students = await Student.findAll({
                    include: [
                        { model: User, attributes: { exclude: ['password'] } },
                        { model: Club, where: { id: club.id } }
                    ]
                });
                const info = await transporter.sendMail({
                    from: '"APCMS"<smrchong28@gmail.com>',
                    to: advisor.User.email,
                    subject: `Reminder for ${club.clubName} activity`,
                    text: `You have an activity for ${club.clubName} on ${nextActivityDay.format('YYYY-MM-DD')} from ${club.activityStartTime} to ${club.activityEndTime}.`,
                    html: `You have an activity for <b>${club.clubName}</b> on <b>${nextActivityDay.format('YYYY-MM-DD')}</b> from <b>${club.activityStartTime}</b> to <b>${club.activityEndTime}</b>.`,
                });
                console.log("Message sent: %s", info.messageId);
                for (const student of students) {
                    console.log(student.User.email);
                    const info = await transporter.sendMail({
                        from: '"APCMS"<smrchong28@gmail.com>',
                        to: student.User.email,
                        subject: `Reminder for ${club.clubName} activity`,
                        text: `You have an activity for ${club.clubName} on ${nextActivityDay.format('YYYY-MM-DD')} from ${club.activityStartTime} to ${club.activityEndTime}.`,
                        html: `You have an activity for <b>${club.clubName}</b> on <b>${nextActivityDay.format('YYYY-MM-DD')}</b> from <b>${club.activityStartTime}</b> to <b>${club.activityEndTime}</b>.`,
                    });
                    console.log("Message sent: %s", info.messageId);
                }
            }
        });
    },
    async sendAccountCreated(email:string, password:string) {
        const info = await transporter.sendMail({
            from: '"APCMS"<smrchong28@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Your APCMS Account Created", // Subject line
            html: `
            <p><b>Your account has been created!</b></p>
            <p>Email: ${email}</p>
            <p>Password: ${password}</p>
            <p>Please change your password after your first login.</p>
          `, // html body
        });
    }
}
