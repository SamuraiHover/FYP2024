// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/services/AdvisorService.js
// Description       : AdvisorService.js is a service file that provides functions to interact with the backend of the application.
import Api from "./Api";

export default {
    getNonClubAdvisorList(){
        return Api().get('nonClubAdvisorList');
    },
    getClubAdvisorList(){
        return Api().get('clubAdvisorList');
    },
    getAdvisorList(){
        return Api().get('advisorList');
    },
    getAdvisor(user){
        return Api().post('advisor/get', user);
    }
}