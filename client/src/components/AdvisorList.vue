// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/components/AdvisorList.vue
// Description       : The AdvisorList component is used to display the list of advisors in the system.
<template>
    <q-table bordered :title="title" :rows="tableData" :columns="qTableHeader()" :row-key="rowkey" selection="single"
        v-model:selected="selected" @update:selected="togglerFunction()" no-data-label="I didn't find anything for you"
        :filter="filter" :filter-method="filterData">
        <template v-slot:top>
            <div class="col-2 q-table__title">{{ title }}</div>
            <q-space />
            <!--LayoutType: NonClubAdvisor-->
            <q-btn class="q-ml-md" color="green" label="Add" :disabled="toggler" @click="closeParentDialog()"
                v-show="props.layoutType == 'NonClubAdvisor'" />
            <!--LayoutType: AllAdvisor-->
            <q-btn class="q-ml-md" color="blue" label="Add New Advisor Account" @click="openAddDialog()"
                v-show="props.layoutType == 'AllAdvisor'" />

            <q-input v-model="filter" dense outlined input-class="text-left" class="q-ml-md" placeholder="Search">
                <template v-slot:append>
                    <q-icon v-if="filter === ''" name="search" />
                    <q-icon v-else name="clear" class="cursor-pointer" @click="filter = ''" />
                </template>
            </q-input>
        </template>
    </q-table>

    <q-dialog v-model="addDialog" persistent>
        <q-card>
            <q-card-section class="row items-center q-pb-none">
				<div class="text-h6">New Advisor Account</div>
				<q-space />
				<q-btn icon="close" flat round dense @click="closeAddDialog()" />
			</q-card-section>
            <q-card-section>
                <q-input filled class="q-mt-md" v-model="manipulatedData.name" label="Name"></q-input>
                <q-select filled class="q-mt-md" v-model="manipulatedData.gender" :options="['Male', 'Female']"
                    label="Gender"></q-select>
                <q-input filled class="q-mt-md" v-model="manipulatedData.email" label="Email Address"></q-input>
                <q-input filled class="q-mt-md" v-model="manipulatedData.password" :type="isPwd ? 'password' : 'text'"
                    label="Password">
                    <template v-slot:append>
                        <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                            @click="isPwd = !isPwd" />
                    </template>
                </q-input>
                <div v-html="error" class="warning text-center q-mt-md"></div>
            </q-card-section>
            <q-card-section class="row justify-end">
                <q-btn flat class="q-ml-md" @click="closeAddDialog()" color="secondary" label="Close"></q-btn>
                <q-btn class="q-ml-md" @click="register" color="primary" label="Register"></q-btn>
            </q-card-section>
        </q-card>
    </q-dialog>


</template>

<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';
import { Loading} from 'quasar';
import { defineProps } from 'vue';
import { defineEmits } from 'vue';


import AdvisorService from '../services/AdvisorService';
import AuthenticationService from '../services/AuthenticationService';

const props = defineProps(["layoutType" , "inputData"]);
const emit = defineEmits(["closeDialog", "update:manipulatedData"]);
/*

LayoutType: NonClubAdvisor
inputData: null

LayoutType: AllAdvisor
inputData: null

*/

const title = ref('');
const rowkey = ref('');
const filter = ref("");
const isPwd = ref(true);
const addDialog = ref(false);
const qTableHeader = () =>{
	if(props.layoutType == "NonClubAdvisor"){
		title.value = 'Unassigned Advisors';
		rowkey.value = 'id';
		console.log("NonClubAdvisor");
		return [
			{ name: 'id', label: 'ID', field: row => row.id, align: 'left', sortable: true},
			{ name: 'name', required: true, label: 'Name', align: 'left', field: row => row.User.name, format: val => `${val}`, sortable: true },
			{ name: 'email', label: 'Email', align: 'left', field: row => row.User.email },
			{ name: 'gender', label: 'Gender', align: 'center',field: row => row.User.gender }
		];
	}
    else if(props.layoutType == "ClubAdvisor" || props.layoutType == "AllAdvisor"){
        title.value = 'Advisors';
        rowkey.value = 'id';
        console.log("ClubAdvisor // AllAdvisor ");
        return [
            { name: 'id', label: 'ID', field: row => row.id, align: 'left', sortable: true},
            { name: 'name', required: true, label: 'Name', align: 'left', field: row => row.User.name, format: val => `${val}`, sortable: true },
            { name: 'email', label: 'Email', align: 'left', field: row => row.User.email },
            { name: 'gender', label: 'Gender', align: 'center',field: row => row.User.gender },
            { name: 'clubName', label: 'Club Name', align: 'center',field: row => (row.Club ? row.Club.clubName : 'Unoccupied') }
    ]
    }
    else{
        console.log("error catched: invalid layoutType");
        return [];
    }
}

var tableData = ref([]);
const selected= ref([]);
const toggler= ref(true);
const manipulatedData= ref(null);
const error= ref(null);

function closeParentDialog() {
    console.log("selected:: " + selected.value[0].User.name);
    emit('update:manipulatedData', {id: selected.value[0].id, name: selected.value[0].User.name, email: selected.value});
    emit('closeDialog');
}

function openAddDialog() {
    manipulatedData.value = {};
    addDialog.value = true;
}

function closeAddDialog() {
    addDialog.value = false;
    manipulatedData.value = null;
    error.value = null;
}


async function register() {
    try {
        Loading.show();
        await AuthenticationService.register({
            email: manipulatedData.value.email ? manipulatedData.value.email : "",
            password: manipulatedData.value.password ? manipulatedData.value.password : "",
            name: manipulatedData.value.name ? manipulatedData.value.name : "",
            role: "Advisor",
            gender: manipulatedData.value.gender ? manipulatedData.value.gender : ""
        })
        closeAddDialog();
        refresh();
    }
    catch (err) {
        console.log(err)
        error.value = err.response.data.error;
    }
    Loading.hide();
}

function filterData(rows, term) {
	
	if (term.trim() === '') return rows;
	if(props.layoutType == "NonClubAdvisor"){
		const filteredItems = tableData.value.filter(item => `${item.User.name} || ${item.User.email} || ${item.User.gender}`.toLowerCase().includes(term.toLowerCase()));
		return filteredItems;
	}
	else if(props.layoutType == "ClubAdvisor" || props.layoutType == "AllAdvisor"){
		const filteredItems = tableData.value.filter(item => `${item.User.name} || ${item.User.email} || ${item.User.gender} || ${item.Club.clubName}`.toLowerCase().includes(term.toLowerCase()));
		return filteredItems;
	}
	else{
		console.log("error catched: invalid layoutType");
		return [];
	}
}

async function fetchData() {
	Loading.show();
	console.log("id:: " + JSON.stringify(props.inputData));

	try {
		if (props.layoutType == "NonClubAdvisor") {
			const advisorList = await AdvisorService.getNonClubAdvisorList();
            console.log("advisorList:: ")
            console.log(advisorList.data);
            tableData.value = advisorList.data;
            console.log(tableData.value);
        }
        else if (props.layoutType == "ClubAdvisor") {
            const advisorList = await AdvisorService.getClubAdvisorList();
            console.log("advisorList:: ")
            console.log(advisorList.data);
            tableData.value = advisorList.data;
            console.log(tableData.value);
        }
        else if (props.layoutType == "AllAdvisor") {
            const advisorList = await AdvisorService.getAdvisorList();
            console.log("advisorList:: ")
            console.log(advisorList.data);
            tableData.value = advisorList.data;
            console.log(tableData.value);
        }
        else {
            console.log("error catched: invalid layoutType");
            tableData.value = [];
        }
	} catch (error) {
		console.log("error catched: AxiosError");
		tableData.value = [];
	}
	Loading.hide();
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

onMounted(() => {
	fetchData();
	
});

</script>
