// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/src/models/associations.ts
// Description       : The associations of the models.

import User from './User';
import Club from './Club';
import Student from './Student';    
import Advisor from './Advisor';
import Post from './Post';
import PostLiked from './PostLiked';
import Badge from './Badge';
import StudentBadge from './StudentBadge';
import FormApplication from './FormApplication';

User.hasOne(Advisor, { foreignKey: 'userId' });
User.hasOne(Student, { foreignKey: 'userId' });
User.hasMany(Post, { foreignKey: 'userId' })
User.hasMany(FormApplication, { foreignKey: 'userId' });

Club.hasOne(Advisor, { foreignKey: 'clubId' });
Club.hasMany(Student, { foreignKey: 'clubId' });
Club.hasMany(Post, { foreignKey: 'clubId' })
Club.hasMany(FormApplication, { foreignKey: 'clubId' });

Advisor.belongsTo(User, { foreignKey: 'userId'});
Advisor.belongsTo(Club, { foreignKey: 'clubId'});

Student.belongsTo(Club, { foreignKey: 'clubId' });
Student.belongsTo(User, { foreignKey: 'userId' });

Post.belongsTo(User, { foreignKey: 'userId' });
Post.belongsTo(Club, { foreignKey: 'clubId' });

Post.belongsToMany(User, { through: PostLiked, foreignKey: 'postId' });
User.belongsToMany(Post, { through: PostLiked, foreignKey: 'userId' });

Student.belongsToMany(Badge, { through: StudentBadge, foreignKey: 'studentId' });
Badge.belongsToMany(Student, { through: StudentBadge, foreignKey: 'badgeId' });

FormApplication.belongsTo(User, { foreignKey: 'userId' });
FormApplication.belongsTo(Club, { foreignKey: 'clubId' });

Student.hasMany(StudentBadge, { foreignKey: 'studentId' });
StudentBadge.belongsTo(Student, { foreignKey: 'studentId' });
StudentBadge.belongsTo(Badge, { foreignKey: 'badgeId' });
Badge.hasMany(StudentBadge, { foreignKey: 'badgeId' });