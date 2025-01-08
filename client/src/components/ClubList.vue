// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/components/ClubList.vue
// Description       : The BadgeList component is used to display the list of badges in the system.
<template>
	<div class="q-pa-md">
		<q-table bordered title="Clubs & Society" :rows="tableData" :columns="qTableHeader" row-key="id"
			selection="single" v-model:selected="selected" @update:selected="togglerFunction()"
			no-data-label="I didn't find anything for you" :filter="filter" :filter-method="filterData">
			<template v-slot:top>
				<div class="col-2 q-table__title">Clubs & Society</div>
				<q-space />
				<q-btn class="q-ml-md" color="green" label="Add" @click="openAddDialog()" />
				<q-btn class="q-ml-md" color="red" label="Delete" :disabled="toggler" @click="ClubDelete()" />
				<q-btn class="q-ml-md" label="Config Member" :disabled="toggler" @click="openConfigDialog()" />
				<q-btn class="q-ml-md" label="Config Club" :disabled="toggler" @click="openEditDialog()" />
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
		<q-card style="width: 400px">
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6">Add New Club</div>
				<q-space />
				<q-btn icon="close" flat round dense @click="closeAddDialog()" />
			</q-card-section>
			<q-card-section class="q-pa-md">
				<q-input filled v-model="manipulatedData.clubName" label="Club Name" class="col q-mb-md"
					:rules="[val => !!val || 'Field is required']" />
				<q-input filled v-model="manipulatedData.clubDescription" label="Description" class="col q-mb-md"
					:rules="[val => !!val || 'Field is required']" />
				<q-input readonly filled v-model="manipulatedData.advisorName" label="Advisor Name" class="col q-mb-md"
					hint="Assign Advisor using the ADD ADVISOR button below" />
				<q-input v-show="false" filled v-model="manipulatedData.advisorId" label="Advisor ID"
					class="col q-mb-md" />
				<q-input type="number" filled v-model="manipulatedData.committeeNo" label="Committee Number"
					class="col q-mb-md"
					:rules="[val => (val && val > 0) || 'Committee Number must be a positive integer']" />
				<q-seperator />
				<div class="text-h6">Club Activity Date Time</div>
				<q-select filled v-model="manipulatedData.activityDay" label="Day of the Week" class="col q-mb-md"
					:options="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']" />
				<div class="row q-mb-md">
					<q-input type="time" filled v-model="manipulatedData.activityStartTime" label="Start Time"
						class="col q-mr-sm" :rules="[val => !manipulatedData.endTime || val <= manipulatedData.endTime || 'Start time cannot be after end time',
							val => val >= '08:00' || 'Start time cannot be before 8 AM',
							val => val < '18:00' || 'Start time cannot be after 6 PM']">
						<template v-slot:hint>
							Required
						</template>
					</q-input>
					<q-input type="time" filled v-model="manipulatedData.activityEndTime" label="End Time"
						class="col q-ml-sm" :rules="[val => !manipulatedData.startTime || val >= manipulatedData.startTime || 'End time cannot be before start time',
							val => val > '08:00' || 'Start time cannot be before 8 AM',
							val => val <= '18:00' || 'Start time cannot be after 6 PM']">
						<template v-slot:hint>
							Required
						</template>
					</q-input>
				</div>
			</q-card-section>
			<q-card-section class="row justify-between">
				<q-btn class="q-mr-md" label="Add Advisor" color="blue" @click="addAdvisorDialog = true" />
				<div>
					<q-btn class="q-ml-md" label="Close" color="secondary" flat @click="closeAddDialog()" />
					<q-btn class="q-ml-md" label="Save" color="green" @click="ClubAdd()"
						:disable="!disableButton" />
				</div>
			</q-card-section>
		</q-card>
	</q-dialog>

	<q-dialog v-model="configDialog" persistent :maximized="true" transition-show="slide-down"
		transition-hide="slide-up">
		<q-card>
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6 text-weight-bold">{{selected[0].clubName}}</div>
				<q-space />
				<q-btn icon="close" flat round dense @click="closeConfigDialog()" />
			</q-card-section>
			<q-card-section class="q-pa-md" style="width:450px">
				<q-item>
					<q-item-section class="text-weight-bold">Club Name:</q-item-section>
					<q-item-section>{{selected[0].clubName}}</q-item-section>
				</q-item>
				<q-item>
					<q-item-section class="text-weight-bold">Club Description:</q-item-section>
					<q-item-section>{{selected[0].clubDescription}}</q-item-section>
				</q-item>
				<q-item>
					<q-item-section class="text-weight-bold">Committee Number:</q-item-section>
					<q-item-section>{{selected[0].committeeNo}}</q-item-section>
				</q-item>
				<q-item>
					<q-item-section class="text-weight-bold">Advisor Name</q-item-section>
					<q-item-section>{{selected[0].Advisor.User.name}}</q-item-section>
				</q-item>
				<q-item>
					<q-item-section class="text-weight-bold">Club Activity Day:</q-item-section>
					<q-item-section>{{selected[0].activityDay}}</q-item-section>
				</q-item>
				<q-item>
					<q-item-section class="text-weight-bold">Club Activity Time:</q-item-section>
					<q-item-section>{{selected[0].activityStartTime}} - {{selected[0].activityEndTime}}</q-item-section>
				</q-item>
			</q-card-section>
			<q-card-section class="">
				<div class="q-pa-md">
					<StudentList :layoutType="'ClubMember'" :inputData="selected[0]" />
				</div>
			</q-card-section>
			<q-card-section class="row justify-end">
				<q-btn class="q-ml-md" label="Close" color="secondary" flat @click="closeConfigDialog()" />
			</q-card-section>
		</q-card>
	</q-dialog>

	<q-dialog v-model="editDialog" persistent>
		<q-card style="width: 400px">
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6">Update Club Info</div>
				<q-space />
				<q-btn icon="close" flat round dense @click="closeEditDialog()" />
			</q-card-section>
			<q-card-section class="q-pa-md">
				<q-input filled v-model="manipulatedData.clubName" label="Club Name" class="col q-mb-md"
					:rules="[val => !!val || 'Field is required']" />
				<q-input filled v-model="manipulatedData.clubDescription" label="Description" class="col q-mb-md"
					:rules="[val => !!val || 'Field is required']" />
				<q-input readonly filled v-model="manipulatedData.Advisor.User.name" label="Advisor Name"
					class="col q-mb-md" hint="Assign Advisor using the REPLACE ADVISOR button below" />
				<q-input v-show="false" filled v-model="manipulatedData.Advisor.advisorId" label="Advisor ID"
					class="col q-mb-md" />
				<q-input type="number" filled v-model="manipulatedData.committeeNo" label="Committee Number"
					class="col q-mb-md"
					:rules="[val => (val && val > 0) || 'Committee Number must be a positive integer']" />
				<q-seperator />
				<div class="text-h6">Club Activity Date Time</div>
				<q-select filled v-model="manipulatedData.activityDay" label="Day of the Week" class="col q-mb-md"
					:options="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']" />
				<div class="row q-mb-md">
					<q-input type="time" filled v-model="manipulatedData.activityStartTime" label="Start Time"
						class="col q-mr-sm" :rules="[val => !manipulatedData.endTime || val <= manipulatedData.endTime || 'Start time cannot be after end time',
							val => val >= '08:00' || 'Start time cannot be before 8 AM',
							val => val < '18:00' || 'Start time cannot be after 6 PM']">
						<template v-slot:hint>
							Required
						</template>
					</q-input>
					<q-input type="time" filled v-model="manipulatedData.activityEndTime" label="End Time"
						class="col q-ml-sm" :rules="[val => !manipulatedData.startTime || val >= manipulatedData.startTime || 'End time cannot be before start time',
							val => val > '08:00' || 'Start time cannot be before 8 AM',
							val => val <= '18:00' || 'Start time cannot be after 6 PM']">
						<template v-slot:hint>
							Required
						</template>
					</q-input>
				</div>
			</q-card-section>
			<q-card-section class="row justify-between">
				<q-btn class="q-mr-md" label="Replace Advisor" color="blue" @click="addAdvisorDialog = true" />
				<div>
					<q-btn class="q-ml-md" label="Close" color="secondary" flat @click="closeEditDialog()" />
					<q-btn class="q-ml-md" label="Save" color="green" @click="ClubInfoChange()"
						:disable="!disableButton" />
				</div>
			</q-card-section>
		</q-card>
	</q-dialog>

	<q-dialog v-model="addAdvisorDialog" persistent>
		<q-card>
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6">Assign Advisor</div>
				<q-space />
				<q-btn icon="close" flat round dense v-close-popup />
			</q-card-section>
			<q-card-section class="q-pa-md">
				<AdvisorList @update:manipulatedData="changeManipulatedData($event)"
					@closeDialog="addAdvisorDialog = false" :layoutType="'NonClubAdvisor'"
					:inputData="manipulatedData.value" />
			</q-card-section>
			<q-card-section class="row justify-end">
				<q-btn class="q-ml-md" label="Close" color="secondary" flat v-close-popup />
			</q-card-section>
		</q-card>
	</q-dialog>




</template>

<script setup>
import ClubService from '../services/ClubService';
import { ref } from 'vue';
import { toRaw } from 'vue';
import { onMounted } from 'vue';
import { Notify } from 'quasar';
import { computed } from 'vue';
import StudentList from './StudentList.vue';
import AdvisorList from './AdvisorList.vue';


const filter = ref("");
const qTableHeader = [
	{ name: 'clubName', required: true, label: 'Club Name', align: 'left', field: 'clubName', format: val => `${val}`, sortable: true },
	{ name: 'clubDescription', label: 'Description', field: 'clubDescription', sortable: true, align: 'left' },
	{ name: 'advisorName', label: 'Advisor Name', field: row => row.Advisor.User.name, sortable: true , align: 'left'  },
	{ name: 'committeeNo', label: 'Committee Number', field: 'committeeNo', align: 'center'},
];
var tableData = ref([]);
const selected= ref([]);
const toggler= ref(true);
const editDialog= ref(false);
const addDialog= ref(false);
const addAdvisorDialog= ref(false);
const configDialog= ref(false);
const manipulatedData= ref(null);

function changeManipulatedData(data) {
	if(manipulatedData.value.Advisor == null) {
		manipulatedData.value.advisorId = data.id;
		manipulatedData.value.advisorName = data.name;
	}else{
		manipulatedData.value.Advisor.id = data.id;
		manipulatedData.value.Advisor.User.name = data.name;
	}
	
	
}

function filterData(rows, term) {
	const filteredItems = tableData.value.filter(item => `${item.clubName} || ${item.clubDescription} || ${item.name} || ${item.commiteeNo}`.toLowerCase().includes(term.toLowerCase()));
	return filteredItems;
}
async function fetchData() {
	try {
		const clubList = await ClubService.getClubs();
		console.log(clubList.data);
		tableData.value = clubList.data;
		console.log(tableData.value);
	} catch (AxiosError) {
		console.log("error catched");

		tableData.value = [];
	}
}
async function ClubDelete() {
	try {
		await ClubService.deleteClub({
			id: toRaw(selected.value)[0].id
		});
		refresh();
		Notify.create({
			message: 'Club Deleted',
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

async function ClubAdd() {
	try {
		await ClubService.addClub(toRaw(manipulatedData.value));
		closeAddDialog();
		refresh();
		Notify.create({
			message: 'Club Added',
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
async function ClubInfoChange() {
	try {
		await ClubService.updateClub(toRaw(manipulatedData.value));
		closeEditDialog();
		refresh();
		Notify.create({
			message: 'Club Changed',
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

function togglerFunction() {
	if (selected.value.length > 0) {
		toggler.value = false;
	} else {
		toggler.value = true;
	}
}

const disableButton = computed({
    get() {
        for (const [item] of Object.entries(manipulatedData.value)) {
            if (manipulatedData.value[item] == '') {
                return false
            }
        }
		if(manipulatedData.value.committeeNo <= 0){
			return false
		}
        if(manipulatedData.value.activityStartTime < '08:00' || manipulatedData.value.activityEndTime > '18:00' || manipulatedData.value.activityEndTime <= '08:00' || manipulatedData.value.activityStartTime >= '18:00'){
            return false
        }
        return true
    }
});

function refresh() {
	selected.value = [];
	togglerFunction();
	fetchData();
}
function openConfigDialog() {
  manipulatedData.value = JSON.parse(JSON.stringify(selected.value[0]));
  configDialog.value = true;
}
function closeConfigDialog() {
	manipulatedData.value = null;
  configDialog.value = false;
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
	clubName: '',
	clubDescription: '',
	advisorName: '',
	advisorId: '',
	committeeNo: 0,
	activityDay: '',
	activityStartTime: '',
	activityEndTime: '',
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
