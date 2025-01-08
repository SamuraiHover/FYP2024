// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/src/routes.ts
// Description       : The routes of the server.
import express, {Request, Response } from "express";
import multer from "multer";
const AuthenticationController = require('./controller/AuthenticationController');
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy');
const ClubController = require('./controller/ClubController');
const StudentController = require('./controller/StudentController');
const AdvisorController = require('./controller/AdvisorController');
const PostController = require('./controller/PostController');
const BadgeController = require('./controller/BadgeController');
const EventController = require('./controller/EventController');
const FormApplicationController = require('./controller/FormApplicationController');
import path from 'path';



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

const upload = multer({ storage: storage });

module.exports = (app:express.Express) =>  {
  app.post( '/register', 
    AuthenticationControllerPolicy.register,
    AuthenticationController.register);

  app.post( '/login',
    AuthenticationController.login
  );

  app.post( '/getUser',
    AuthenticationController.getUser
  );

  app.post('/updateUser',
    AuthenticationControllerPolicy.updateUser,
    AuthenticationController.updateUser
  );

  app.post('/updatePassword',
    AuthenticationController.updatePassword
  );


  app.get( '/student/getAll',
    StudentController.studentListRequest
  );

  app.post( '/student/getAll/badgeAssigned',
    StudentController.studentBadgeAssignedListRequest
  );
  app.post( '/student/getAll/badgeUnassigned',
    StudentController.studentBadgeUnassignedListRequest
  );

  //Club
  app.post('/clubInfo',
    ClubController.clubCreate
  );
  app.get('/clubList',
    ClubController.clubListRequest
  );
  app.post('/clubStudentList',
    ClubController.clubStudentListRequest
  );
  app.delete('/clubStudents',
    ClubController.removeStudentFromClub
  );
  app.delete('/clubInfo',
    ClubController.clubInfoDelete);

  app.get('/nonClubStudents',
    StudentController.nonClubStudentsRequest
  );
  app.post('/clubStudents', 
    ClubController.addStudentToClub
  );
  app.post('/clubStudentToCommittee',
    ClubController.addStudentToCommittee
  );
  app.post('/clubCommitteeList',
    ClubController.clubCommitteeListRequest
  );
  app.delete('/clubCommittee',
    ClubController.removeStudentFromCommittee
  );
  app.put('/clubInfo', 
    ClubController.clubInfoUpdate
  );
  app.post('/clubInfo/get',
    ClubController.clubInfoRequest
  );

  app.get('/nonClubAdvisorList',
    AdvisorController.nonClubAdvisorListRequest
  );
  app.get('/clubAdvisorList',
    AdvisorController.clubAdvisorListRequest
  );
  app.get('/advisorList',
    AdvisorController.advisorListRequest
  );
  
  app.post('/student/get',
    StudentController.studentRequest
  );

  app.post('/advisor/get',
  AdvisorController.advisorRequest
);
  //Posts
  app.post('/userPosts/getPersonal',
    PostController.personalPostListRequest
  );
  app.post('/userPosts/create',
    upload.single('image'),
    PostController.createUserPost
  );
  app.delete('/userPosts/delete',
    PostController.deleteUserPost
  );
  app.post('/userPosts/update',
    PostController.updateUserPost
  );

  app.post('/clubPosts/getClub',
    PostController.clubPostListRequest
  );
  app.post('/clubPosts/create',
    upload.single('image'),
    PostController.createClubPost
  );
  app.delete('/clubPosts/delete',
    PostController.deleteClubPost
  );
  app.post('/clubPosts/update',
    PostController.updateClubPost
  );

  app.post('/posts/getAll',
  PostController.getAllPosts
  );
  app.post('/posts/getAllClubOnly',
    PostController.getAllPostsClubOnly
  );
  
  app.post('/posts/like',
    PostController.likePost
  );
  app.post('/posts/unlike',
    PostController.unlikePost
  );

  //Badges
  app.get('/badge/getAll',
    BadgeController.badgeListRequest
  );
  app.post('/badge/create',
    BadgeController.badgeCreate
  );
  app.post('/badge/update',
    BadgeController.badgeUpdate
  );
  app.delete('/badge/delete',
    BadgeController.badgeDelete
  );
  app.post('/badge/assign',
    BadgeController.badgeAssign
  );
  app.post('/badge/unassign',
    BadgeController.badgeUnassign
  );

  //Events
  app.get('/event/getAllCalendar',
    EventController.eventListCalendarRequest
  );
  app.get('/event/getAll',
    EventController.eventListRequest
  );
  app.post('/event/getDetails',
    EventController.eventDetailsRequest
  )
  app.post('/event/create',
    EventController.eventCreate
  );
  app.put('/event/update',
    EventController.eventUpdate
  );
  app.delete('/event/delete',
    EventController.eventDelete
  );

  //Form Applications
  app.post('/formApplication/getAll',
    FormApplicationController.formApplicationListRequest
  );
  app.post('/formApplication/getUser',
    FormApplicationController.formApplicationListRequestUser
  );
  app.post('/formApplication/getClub',
    FormApplicationController.formApplicationListRequestClub
  );
  app.post('/formApplication/create',
    FormApplicationController.formApplicationCreate
  );
  app.put('/formApplication/update',
    FormApplicationController.formApplicationUpdate
  );
  app.delete('/formApplication/delete',
    FormApplicationController.formApplicationDelete
  );

}
