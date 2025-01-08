// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/services/BadgeService.js
// Description       : BadgeService.js is a service file that provides functions to interact with the backend of the application.
import Api from "./Api";

export default {
    getBadges(){
        return Api().get('badge/getAll');
    },    
    addBadge(badge){
        return Api().post('badge/create', badge);
    },
    updateBadge(badge){
        return Api().post('badge/update', badge);
    },
    deleteBadge(badge){
        return Api().delete('badge/delete', {data: badge});
    },
    assignBadge(badge){
        return Api().post('badge/assign', badge);
    },
    unassignBadge(badge){
        return Api().post('badge/unassign', badge);
    },
}