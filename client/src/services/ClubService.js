// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/services/ClubService.js
// Description       : ClubService.js is a service file that provides functions to interact with the backend of the application.
import Api from "./Api";
export default {
    getClubs(){
        return Api().get('clubList');
    },
    deleteClub(club){
        return Api().delete('clubInfo', {data: club});
    },
    addClub(club){
        return Api().post('clubInfo', club);
    },
    getClubStudents(data){
        return Api().post('clubStudentList', data);
    },
    removeStudentFromClub(student){
        console.log(student)
        return Api().delete('clubStudents', {data: student});
    },
    addStudentToClub(student){
        return Api().post('clubStudents', student);
    },
    addStudentToCommittee(student){
        return Api().post('clubStudentToCommittee', student);
    },
    getClubCommittee(data){
        return Api().post('clubCommitteeList', data);
    },
    removeStudentFromCommittee(student){
        return Api().delete('clubCommittee', {data: student});
    },
    updateClub(club){
        return Api().put('clubInfo', club);
    },
    getClub(user){
        return Api().post('clubInfo/get', user);
    }
}