// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/components/EventCalendar.vue
// Description       : The EventCalendar component is used to display the calendar of events in the system.
<template>
    <FullCalendar ref="fullCalendar" :options="calenderOptions"  />
    <q-dialog v-model="dialog">
        <q-card style="width:500px">
            <q-card-section>
                <div class="text-h6">{{eventDetails.eventName}} </div>
                <div class="text q-pt-sm">{{eventDetails.eventDescription}} </div>
            </q-card-section>
            <q-card-section>
                <div class="text-secondary q-pt-sm"><q-icon name="event" size="sm"/>&nbsp;&nbsp; {{ eventDetails.startDate }} - {{ eventDetails.endDate }}</div>    
                <div class="text-secondary q-pt-sm"><q-icon name="schedule" size="sm"/>&nbsp;&nbsp; {{ eventDetails.startTime.slice(0, -3) }} - {{ eventDetails.endTime.slice(0, -3) }}</div>
                
            </q-card-section>
            <q-card-actions align="right">
                <q-btn label="Close" color="primary" @click="dialog = false" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import EventService from '@/services/EventService';
import { ref, onMounted } from 'vue'
import { Loading, Notify } from 'quasar'

const events = ref([]);
const fullCalendar = ref(null);
const dialog = ref(false);
const eventDetails = ref(null);

const calenderOptions = {
    themeSystem: 'bootstrap5',
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    eventClick: async function(info) {
        await getEventDetails(info.event.id);
        
    }
}

async function fetchData(){
    Loading.show();
    try {
        const response = await EventService.getEventsCalendar();
        events.value = response.data;
        fullCalendar.value.getApi().addEventSource(events.value);
    } catch (AxiosError) {
        Notify.create({
            message: 'Error while fetching data',
            type: 'negative',
            position: 'top-right'
        });
    }
    Loading.hide();
}

async function getEventDetails(eventId){
    Loading.show()
    try {
        const response = await EventService.getEventDetails({
            id: eventId
        });
        eventDetails.value = response.data;
        dialog.value = true;
    } catch (AxiosError) {
        Notify.create({
            message: 'Error while fetching data',
            type: 'negative',
            position: 'top-right'
        });
    }
    Loading.hide();
}

onMounted(() => {
    fetchData();
    
})

</script>