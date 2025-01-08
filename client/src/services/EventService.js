// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/services/EventService.js
// Description       : EventService.js is a service file that provides functions to interact with the backend of the application.
import Api from "./Api";

export default {
    getEvents(){
        return Api().get('event/getAll');
    },
    getEventsCalendar(){
        return Api().get('event/getAllCalendar');
    },
    getEventDetails(event){
        return Api().post('event/getDetails', event)
    },
    deleteEvent(event){
        return Api().delete('event/delete', {data: event});
    },
    addEvent(event){
        return Api().post('event/create', event);
    },
    updateEvent(event){
        return Api().put('event/update', event);
    }
}