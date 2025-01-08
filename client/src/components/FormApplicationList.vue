// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/components/FormApplicationList.vue
// Description       : The FormApplicationList component is used to display the list of form applications in the system.
<template>
    <div class="q-pa-md">
        <q-tabs v-show="props.layoutType == 'Admin'" v-model="tab" dense class="text-grey" active-color="primary"
            indicator-color="primary" align="left" narrow-indicator>
            <q-tab name="Pending" label="Pending" @click="refresh()"/>
            <q-tab name="PendingAdvisor" label="Pending Advisor" @click="refresh()" />
            <q-tab name="Approved" label="Approved" @click="refresh()" />
            <q-tab name="Rejected" label="Rejected" @click="refresh()" />
        </q-tabs>
        <q-table bordered title="Event" :rows="tableData" :columns="qTableHeader" row-key="id" selection="single"
            v-model:selected="selected" @update:selected="togglerFunction()"
            no-data-label="I didn't find anything for you" :filter="filter" :filter-method="filterData">
            <template v-slot:top>
                <div class="col-2 q-table__title">Application Form</div>
                <q-space />
                <!-- layoutType= Admin -->
                <q-btn v-show="props.layoutType == 'Admin'" class="q-ml-md" :disabled="toggler" label="Info" @click="openInfoDialog()" />
                <!-- layoutType= Student -->
                <q-btn v-show="props.layoutType == 'Student'" class="q-ml-md" color="primary" label="New Form" @click="openAddDialog()" />
                <q-btn v-show="props.layoutType == 'Student'" class="q-ml-md" :disabled="toggler" label="Info" @click="openInfoDialog()" />
                <q-btn v-show="props.layoutType == 'Student'" class="q-ml-md" :disabled="toggler" color="red" label="Delete" @click="FormApplicationDelete()" />
                <!-- layoutType= Club-->
                <q-btn v-show="props.layoutType == 'Club'" class="q-ml-md" color="primary" label="New Form" @click="openAddDialog()" />
                <q-btn v-show="props.layoutType == 'Club'" class="q-ml-md" :disabled="toggler" label="Info" @click="openInfoDialog()" />
                <q-btn v-show="props.layoutType == 'Club'" class="q-ml-md" :disabled="toggler" color="red" label="Delete" @click="FormApplicationDelete()" />
                <!-- layoutType= Advisor -->
                <q-btn v-show="props.layoutType == 'Advisor'" class="q-ml-md" :disabled="toggler" label="Info" @click="openInfoDialog()" />

                <q-input v-model="filter" dense outlined input-class="text-left" class="q-ml-md" placeholder="Search">
                    <template v-slot:append>
                        <q-icon v-if="filter === ''" name="search" />
                        <q-icon v-else name="clear" class="cursor-pointer" @click="filter = ''" />
                    </template>
                </q-input>
            </template>
        </q-table>
    </div>

    <q-dialog v-model="addDialog" persistent maximized transition-show="slide-down"
		transition-hide="slide-up">
        <q-card style="">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">New Form</div>
                <q-space />
                <q-btn icon="close" flat round dense @click="closeAddDialog()" />
            </q-card-section>
            <q-card-section class="q-pa-md">
                <q-select filled v-model="formName" :options="forms()" label="Form" />
                <NewClubForm :readOnly="false" ref="selectedForm" v-if="formName ? formName.value == 'New Club Form': false" />
                <ClubEventRequestForm :readOnly="false" ref="selectedForm" v-if="formName ? formName.value == 'Club Event Request Form': false" />
                <TransportationRequestForm :readOnly="false" ref="selectedForm" v-if="formName ? formName.value == 'Transportation Request Form': false" />
            </q-card-section>
            <q-card-section class="q-pa-md">
            
            </q-card-section>
            <q-card-section class="row justify-between">
                <q-btn class="q-mr-md" label="Close" color="secondary" flat @click="closeAddDialog()" />
                <q-btn v-if="formName" class="q-ml-md" label="Save" color="green" @click="FormApplicationAdd()" :disabled="!disableButton"/>
            </q-card-section>
        </q-card>
    </q-dialog>

    <q-dialog v-model="infoDialog" persistent maximized transition-show="slide-down"
		transition-hide="slide-up">
        <q-card style="">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">Form</div>
                <q-space />
                <q-btn icon="close" flat round dense @click="closeInfoDialog()" />
            </q-card-section>
            <q-card-section class="q-pa-md">
                <NewClubForm @mounted="setData()" :readOnly="true" ref="selectedForm" v-if="formName == 'New Club Form'" />
                <ClubEventRequestForm @mounted="setData()" :readOnly="true" ref="selectedForm" v-if="formName == 'Club Event Request Form'" />
                <TransportationRequestForm @mounted="setData()" :readOnly="true" ref="selectedForm" v-if="formName == 'Transportation Request Form'" />

            </q-card-section>
            <q-card-section class="row justify-between">
                <q-btn class="q-ml-md" label="Close" color="secondary" flat @click="closeInfoDialog()" />
                <q-btn v-show="props.layoutType == 'Admin' && selected[0].status == 'Pending'" class="q-ml-md" label="Approve" color="green" @click="formApplicationStatus('Approved')" />
                <q-btn v-show="props.layoutType == 'Advisor' && selected[0].status == 'PendingAdvisor'" class="q-ml-md" label="Approve" color="green" @click="formApplicationStatus('Pending')" />
                <q-btn v-show="(props.layoutType == 'Admin' && selected[0].status == 'Pending') || (props.layoutType == 'Advisor' && selected[0].status == 'PendingAdvisor')" class="q-ml-md" label="Reject" color="red" @click="formApplicationStatus('Rejected')" />
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup>

import FormApplicationService from '../services/FormApplicationService';
import { ref } from 'vue';
//import { toRaw } from 'vue';

import { onMounted } from 'vue';
import { defineProps } from 'vue';
import { computed } from 'vue';
import { watch } from 'vue';
import { Notify } from 'quasar';
import { Loading } from 'quasar';
import { useStore } from '../store/store.js'
import NewClubForm from './form/NewClubForm.vue';
import ClubEventRequestForm from './form/ClubEventRequestForm.vue';
import TransportationRequestForm from './form/TransportationRequestForm.vue';
import ClubService from '@/services/ClubService';

const store = useStore();
const filter = ref("");
const qTableHeader = [
    { name: 'name', required: true, label: 'Student Name', align: 'left', field: row => row.User.name, sortable: true },
    { name: 'clubName', required: true, label: 'Club Name', align: 'left', field: row => row.Club ? row.Club.clubName : 'N/A', sortable: true},
	{ name: 'formName', required: true, label: 'Form Name', align: 'left', field: 'formName', sortable: true },
	{ name: 'status', label: 'Status', field: 'status', align: 'center' },
    { name: 'lastUpdated', label: 'Last Update', field: 'lastUpdated', align: 'right', sortable: true  },
];
var tableData = ref([]);
const selected= ref([]);
const toggler= ref(true);
const addDialog= ref(false);
const infoDialog= ref(false);
const tab = ref('Pending');
const manipulatedData= ref(null);
const formName = ref(null);
const club = ref(null);
const forms = () => {
    if(props.layoutType == 'Club'){
        return [
            { label: 'Club Event Request Form', value: 'Club Event Request Form' },
            { label: 'Transportation Request Form', value: 'Transportation Request Form' }
        ];
    }
    else{
        return [
            { label: 'New Club Form', value: 'New Club Form' },
            { label: 'Transportation Request Form', value: 'Transportation Request Form' }
        ];
    }
}

const selectedForm = ref(null);

const props = defineProps(['layoutType']);
/*
layoutType: Admin
layoutType: Student
layoutType: Club
layoutType: Advisor
*/

watch(() => props.layoutType, () => {
    refresh();
});
function filterData(rows, term) {
	const filteredItems = tableData.value.filter(item => `${item.User.name} || ${item.formName}, || ${item.Club ? item.Club.name : null}, || ${item.status}`.toLowerCase().includes(term.toLowerCase()));
	return filteredItems;
}



async function fetchData() {
    Loading.show();
	try {
        if(props.layoutType == 'Admin'){
            const response = await FormApplicationService.getFormApplicationList({
                status: tab.value
            });
            tableData.value = response.data;
        }
        else if(props.layoutType == 'Student'){
            const response = await FormApplicationService.getFormApplicationByUser({
                userId: store.id
            });
            tableData.value = response.data;
        }
        else if (props.layoutType == 'Club' || props.layoutType == 'Advisor') {
            const clubResponse = await ClubService.getClub({
                id: store.id,
                role: store.role
            });
            club.value = clubResponse.data;
            const response = await FormApplicationService.getFormApplicationByClub({
                userId: store.id,
                role: store.role
            });
            tableData.value = response.data;
        }
        else {
            console.log("Incorrect layoutType");
            tableData.value = [];
        }
        console.log(tableData.value);
        
	} catch (AxiosError) {
		console.log("error catched");

		tableData.value = [];
	}
    Loading.hide()
}

const disableButton = computed({
    get() {
        console.log("trigger")
        if(!formName.value || !selectedForm.value) {
            return true
        }
        for (const [item] of Object.entries(selectedForm.value.manipulatedData)) {
            if (selectedForm.value.manipulatedData[item] == '') {
                return false
            }
        }
        return true
    }
});

async function FormApplicationAdd(){
    manipulatedData.value = selectedForm.value.manipulatedData
    console.log(manipulatedData.value);
    try{
        const response = await FormApplicationService.addFormApplication({
            formName: formName.value.value,
            formData: JSON.stringify(manipulatedData.value),
            userId: store.id,
            clubId: club.value? club.value.id : null
        });
        closeAddDialog();
        refresh();
        Notify.create({
            message: response.data.message,
            color: 'blue',
            position: 'top'
        });
    }catch(err){
        console.log(err);
        const errorMsg = err.response ? err.response.data.error : 'An error occurred';
		Notify.create({
			message: errorMsg,
			color: 'negative',
			position: 'top'
		});
    }
}

async function FormApplicationDelete(){
    if(selected.value[0].status == 'Approved' || selected.value[0].status == 'Rejected'){
        Notify.create({
            message: 'Cannot delete a form that is Approved or Rejected',
            color: 'negative',
            position: 'top'
        });
        return;
    }
    try{
        const response = await FormApplicationService.deleteFormApplication({
            id: selected.value[0].id
        });
        refresh();
        Notify.create({
            message: response.data.message,
            color: 'blue',
            position: 'top'
        });
    }catch(err){
        console.log(err);
        const errorMsg = err.response ? err.response.data.error : 'An error occurred';
        Notify.create({
            message: errorMsg,
            color: 'negative',
            position: 'top'
        });
    }
}

async function formApplicationStatus(status){
    try{
        const response = await FormApplicationService.updateFormApplication({
            id: selected.value[0].id,
            status: status
        });
        refresh();
        closeInfoDialog();
        Notify.create({
            message: response.data.message,
            color: 'blue',
            position: 'top'
        });
    }catch(err){
        console.log(err);
        const errorMsg = err.response ? err.response.data.error : 'An error occurred';
        Notify.create({
            message: errorMsg,
            color: 'negative',
            position: 'top'
        });
    }
}

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

function setData(){
    selectedForm.value.setData(JSON.parse(selected.value[0].formData));

}

function openInfoDialog(){
    formName.value = selected.value[0].formName;
    infoDialog.value = true;
}

function closeInfoDialog(){
    selectedForm.value = null;
    formName.value = null;
    infoDialog.value = false;
}

function openAddDialog() {
    manipulatedData.value = {};
    addDialog.value = true;
}

function closeAddDialog() {
	manipulatedData.value = null;
    formName.value = null;
	addDialog.value = false;
}

onMounted(() => {
	fetchData();
});


</script>
