// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/services/AuthenticationService.js
// Description       : AuthenticationService.js is a service file that provides functions to interact with the backend of the application.
import Api from "./Api";

export default{
    register(credentials){
        return Api().post('register', credentials);
    },
    login(credentials){
        return Api().post('login', credentials);
    },
    getUser(credentials){
        return Api().post('getUser', credentials);
    },
    updateUser(credentials){
        return Api().post('updateUser', credentials);
    },
    updatePassword(credentials){
        return Api().post('updatePassword', credentials);
    }

}
