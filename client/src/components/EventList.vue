// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/components/EventList.vue
// Description       : The EventList component is used to display the list of events in the system.
<template>
    <div class="q-pa-md">
        <q-table bordered title="Event" :rows="tableData" :columns="qTableHeader" row-key="id" selection="single"
            v-model:selected="selected" @update:selected="togglerFunction()"
            no-data-label="I didn't find anything for you" :filter="filter" :filter-method="filterData">
            <template v-slot:top>
                <div class="col-2 q-table__title">Event List</div>
                <q-space />
                <q-btn class="q-ml-md" color="green" label="Add" @click="openAddDialog()" />
                <q-btn class="q-ml-md" color="red" label="Delete" :disabled="toggler" @click="EventDelete()" />
                <q-btn class="q-ml-md" label="Edit" :disabled="toggler" @click="openEditDialog()" />
                <q-input v-model="filter" dense outlined input-class="text-left" class="q-ml-md" placeholder="Search">
                    <template v-slot:append>
                        <q-icon v-if="filter === ''" name="search" />
                        <q-icon v-else name="clear" class="cursor-pointer" @click="filter = ''" />
                    </template>
                </q-input>
            </template>
        </q-table>

    </div>

    <q-dialog v-model="addDialog" persistent>
        <q-card style="width: 450px">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">Add New Event</div>
                <q-space />
                <q-btn icon="close" flat round dense @click="closeAddDialog()" />
            </q-card-section>
            <q-card-section class="q-pa-md">
                <q-input bottom-slots filled v-model="manipulatedData.eventName" label="Event Name" class="col q-mb-md">
                    <template v-slot:hint>
                        Required
                    </template>
                </q-input>
                <q-input bottom-slots filled v-model="manipulatedData.eventDescription" label="Event Description"
                    class="col q-mb-md">
                    <template v-slot:hint>
                        Required
                    </template>
                </q-input>
                <div class="row q-mb-md">
                    <q-input type="date" filled v-model="manipulatedData.startDate" label="Start Date"
                        class="col q-mr-sm"
                        :rules="[val => !manipulatedData.endDate || val <= manipulatedData.endDate || 'Start date cannot be after end date']">
                        <template v-slot:hint>
                            Required
                        </template>
                    </q-input>
                    <q-input type="date" filled v-model="manipulatedData.endDate" label="End Date"
                        class="col col q-ml-sm"
                        :rules="[val => !manipulatedData.startDate || val >= manipulatedData.startDate || 'End date cannot be before start date']">
                        <template v-slot:hint>
                            Required
                        </template>
                    </q-input>
                </div>
                <div class="row q-mb-md">
                    <q-input type="time" filled v-model="manipulatedData.startTime" label="Start Time"
                        class="col q-mr-sm"
                        :rules="[val => !manipulatedData.endTime || val <= manipulatedData.endTime || 'Start time cannot be after end time',
                            val => val >= '08:00' || 'Start time cannot be before 8 AM',
                            val => val < '18:00' || 'Start time cannot be after 6 PM']">
                        <template v-slot:hint>
                            Required
                        </template>
                    </q-input>
                    <q-input type="time" filled v-model="manipulatedData.endTime" label="End Time" class="col q-ml-sm"
                        :rules="[val => !manipulatedData.startTime || val >= manipulatedData.startTime || 'End time cannot be before start time',
                            val => val > '08:00' || 'Start time cannot be before 8 AM',
                            val => val <= '18:00' || 'Start time cannot be after 6 PM']">
                        <template v-slot:hint>
                            Required
                        </template>
                    </q-input>
                </div>
            </q-card-section>
            <q-card-section class="row justify-between">
                <q-btn class="q-mr-md" label="Close" color="secondary" flat @click="closeAddDialog()" />
                <q-btn class="q-ml-md" label="Save" color="green" @click="EventAdd()"  
                    :disabled="!disableButton"/>
            </q-card-section>
        </q-card>
    </q-dialog>

    <q-dialog v-model="editDialog" persistent>
        <q-card style="width: 400px">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">Update Event</div>
                <q-space />
                <q-btn icon="close" flat round dense @click="closeEditDialog()" />
            </q-card-section>
            <q-card-section class="q-pa-md">
                <q-input bottom-slots filled v-model="manipulatedData.eventName" label="Event Name" class="col q-mb-md">
                    <template v-slot:hint>
                        Required
                    </template>
                </q-input>
                <q-input bottom-slots filled v-model="manipulatedData.eventDescription" label="Event Description"
                    class="col q-mb-md">
                    <template v-slot:hint>
                        Required
                    </template>
                </q-input>
                <div class="row q-mb-md">
                    <q-input type="date" filled v-model="manipulatedData.startDate" label="Start Date"
                        class="col q-mr-sm"
                        :rules="[val => !manipulatedData.endDate || val <= manipulatedData.endDate || 'Start date cannot be after end date']">
                        <template v-slot:hint>
                            Required
                        </template>
                    </q-input>
                    <q-input type="date" filled v-model="manipulatedData.endDate" label="End Date"
                        class="col col q-ml-sm"
                        :rules="[val => !manipulatedData.startDate || val >= manipulatedData.startDate || 'End date cannot be before start date']">
                        <template v-slot:hint>
                            Required
                        </template>
                    </q-input>
                </div>
                <div class="row q-mb-md">
                    <q-input type="time" filled v-model="manipulatedData.startTime" label="Start Time"
                        class="col q-mr-sm"
                        :rules="[val => !manipulatedData.endTime || val <= manipulatedData.endTime || 'Start time cannot be after end time',
                            val => val >= '08:00' || 'Start time cannot be before 8 AM',
                            val => val < '18:00' || 'Start time cannot be after 6 PM']">
                        <template v-slot:hint>
                            Required
                        </template>
                    </q-input>
                    <q-input type="time" filled v-model="manipulatedData.endTime" label="End Time" class="col q-ml-sm"
                        :rules="[val => !manipulatedData.startTime || val >= manipulatedData.startTime || 'End time cannot be before start time',
                            val => val > '08:00' || 'Start time cannot be before 8 AM',
                            val => val <= '18:00' || 'Start time cannot be after 6 PM']">
                        <template v-slot:hint>
                            Required
                        </template>
                    </q-input>
                </div>
            </q-card-section>
            <q-card-section class="row justify-between">
                <q-btn class="q-mr-md" label="Close" color="secondary" flat @click="closeEditDialog()" />
                <q-btn class="q-ml-md" label="Save" color="green" @click="EventUpdate()" 
                :disabled="!disableButton"/>
            </q-card-section>
        </q-card>
    </q-dialog>


</template>

<script setup>

import EventService from '../services/EventService';
import { ref } from 'vue';
import { toRaw } from 'vue';
import { onMounted } from 'vue';
import { Notify } from 'quasar';
import { computed } from 'vue'


const filter = ref("");
const qTableHeader = [
	{ name: 'eventName', required: true, label: 'Event Name', align: 'left', field: 'eventName', sortable: true },
	{ name: 'eventDescription', label: 'Description', field: 'eventDescription', align: 'right' },
	{ name: 'startDate', label: 'Start Date', field: 'startDate', align: 'center', sortable: true},
    { name: 'endDate', label: 'End Date', field: 'endDate', align: 'center', sortable: true},
    { name: 'startTime', label: 'Start Time', field: 'startTime', align: 'center', sortable: true},
    { name: 'endTime', label: 'End Time', field: 'endTime', align: 'center', sortable: true}
];
var tableData = ref([]);
const selected= ref([]);
const toggler= ref(true);
const editDialog= ref(false);
const addDialog= ref(false);


const manipulatedData= ref(null);

function filterData(rows, term) {
	const filteredItems = tableData.value.filter(item => `${item.eventName} || ${item.eventDescription}`.toLowerCase().includes(term.toLowerCase()));
	return filteredItems;
}
async function fetchData() {
	try {
		const response = await EventService.getEvents();

		tableData.value = response.data;

	} catch (AxiosError) {
		console.log("error catched");

		tableData.value = [];
	}
}
async function EventDelete() {
	try {
		const response = await EventService.deleteEvent({
			id: toRaw(selected.value)[0].id
		});
		refresh();
		Notify.create({
			message: response.data.message,
			color: 'blue',
			position: 'top'
		});
	}
	catch (err) {
		console.log(err);
		Notify.create({
			message: err.response.data.error,
			color: 'negative',
			position: 'top'
		});
	}
}

async function EventAdd() {
	try {
		const response = await EventService.addEvent(toRaw(manipulatedData.value));
		closeAddDialog();
		refresh();
		Notify.create({
			message: response.data.message,
			color: 'blue',
			position: 'top'
		});
	}
	catch (err) {
		console.log(err);
		const errorMsg = err.response ? err.response.data.error : 'An error occurred';
		Notify.create({
			message: errorMsg,
			color: 'negative',
			position: 'top'
		});
	}
}
async function EventUpdate() {
	try {
		const response = await EventService.updateEvent(toRaw(manipulatedData.value));
		closeEditDialog();
		refresh();
		Notify.create({
			message: response.data.message,
			color: 'blue',
			position: 'top'
		});
	}
	catch (err) {
		console.log(err);
		const errorMsg = err.response ? err.response.data.error : 'An error occurred';
		Notify.create({
			message: errorMsg,
			color: 'negative',
			position: 'top'
		});
	}
}

const disableButton = computed({
    get() {
        for (const [item] of Object.entries(manipulatedData.value)) {
            if (manipulatedData.value[item] == '') {
                return false
            }
        }
        if(manipulatedData.value.startDate > manipulatedData.value.endDate){
            return false
        }
        if(manipulatedData.value.startTime > manipulatedData.value.endTime){
            return false
        }
        if(manipulatedData.value.startTime < '08:00' || manipulatedData.value.endTime > '18:00' || manipulatedData.value.endTime <= '08:00' || manipulatedData.value.startTime >= '18:00'){
            return false
        }
        return true
    }
});


function togglerFunction() {
	if (selected.value.length > 0) {
		toggler.value = false;
	} else {
		toggler.value = true;
	}
}

function refresh() {
	selected.value = [];
	togglerFunction();
	fetchData();
}



function openEditDialog() {
  manipulatedData.value = JSON.parse(JSON.stringify(selected.value[0]));
  editDialog.value = true;
}
function closeEditDialog() {
	manipulatedData.value = null;
  editDialog.value = false;
}

function openAddDialog() {
  manipulatedData.value = {
    eventName: '',
    eventDescription: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: ''
  };
  addDialog.value = true;
}

function closeAddDialog() {
	manipulatedData.value = null;
	addDialog.value = false;
}

onMounted(() => {
	fetchData();
});


</script>
