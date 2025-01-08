// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/services/FormApplicationService.js
// Description       : FormApplicationService.js is a service file that provides functions to interact with the backend of the application.
import Api from "./Api";

export default {
    getFormApplicationList(status){
        return Api().post('formApplication/getAll', status);
    },
    getFormApplicationByUser(user){
        return Api().post('formApplication/getUser', user);
    },
    getFormApplicationByClub(user){
        return Api().post('formApplication/getClub', user);
    },
    deleteFormApplication(form){
        return Api().delete('formApplication/delete', {data: form});
    },
    addFormApplication(form){
        return Api().post('formApplication/create', form);
    },
    updateFormApplication(form){
        return Api().put('formApplication/update', form);
    }
}