// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/services/Api.js
// Description       : Api.js is a service file that routes the requests to the backend of the application.
import axios from 'axios';

const baseURL = 'http://localhost:3000/';

export default () => {
    return axios.create({  
        baseURL: baseURL
    });
}

export { baseURL };