// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/services/StudentService.js
// Description       : StudentService.js is a service file that provides functions to interact with the backend of the application.
import Api from "./Api";

export default {
    getStudent(id){
        return Api().post(`student/get`, id);
    },
    getNonClubStudents(){
        return Api().get('nonClubStudents');
    },
    getAllStudents(){
        return Api().get('student/getAll');
    },
    getStudentBadgeUnassignedList(badge){
        return Api().post('student/getAll/badgeUnassigned', badge);
    },
    getStudentBadgeAssignedList(badge){
        return Api().post('student/getAll/badgeAssigned', badge);
    }
}
