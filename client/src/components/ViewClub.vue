// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/components/ViewClub.vue
// Description       : The ViewClub component is used to display the club information to the user.
<template>
	<div class="q-pa-md" v-if="club">
		<q-card flat>
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6 text-weight-bold">{{club.clubName}}</div>
				<q-space />
				<q-btn v-if="store.role == 'Advisor'" flat class="q-ml-md" label="Edit" @click="openEditDialog()" />
			</q-card-section>
			<q-card-section class="q-pa-md" style="width:450px">
				<q-item>
					<q-item-section class="text-weight-bold">Club Name:</q-item-section>
					<q-item-section>{{club.clubName}}</q-item-section>
				</q-item>
				<q-item>
					<q-item-section class="text-weight-bold">Club Description:</q-item-section>
					<q-item-section>{{club.clubDescription}}</q-item-section>
				</q-item>
				<q-item>
					<q-item-section class="text-weight-bold">Committee Number:</q-item-section>
					<q-item-section>{{club.committeeNo}}</q-item-section>
				</q-item>
				<q-item>
					<q-item-section class="text-weight-bold">Club Activity Day:</q-item-section>
					<q-item-section>{{club.activityDay}}</q-item-section>
				</q-item>
				<q-item>
					<q-item-section class="text-weight-bold">Club Activity Time:</q-item-section>
					<q-item-section>{{club.activityStartTime}} - {{club.activityEndTime}}</q-item-section>
				</q-item>
			</q-card-section>
			<q-card-section class="">
				<div class="q-pa-md">
					<StudentList v-if="store.role == 'Student'" :layoutType="'ClubMemberOnly'" :inputData="club" />
					<StudentList v-if="store.role == 'Advisor'" :layoutType="'ClubMember'" :inputData="club" />
				</div>
			</q-card-section>
		</q-card>
	</div>
	
	<div class="q-pa-md" v-else>
		<q-card>
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6 text-weight-bold">No Assigned Club</div>
			</q-card-section>
		</q-card>
	</div>

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

</template>

<script setup>
import ClubService from '../services/ClubService';
import { ref } from 'vue';
import { toRaw } from 'vue';
import { onMounted } from 'vue';
import { computed } from 'vue';
import { Loading } from 'quasar';
import { Notify } from 'quasar';
import { useStore } from '../store/store.js'
import StudentList from './StudentList.vue';


const store = useStore();
const selected= ref([]);
const toggler= ref(true);
const editDialog= ref(false);

const manipulatedData= ref(null);
const club = ref(null);


async function fetchData() {
	Loading.show();
	try {
        const response = await ClubService.getClub({
            id: store.id,
            role: store.role
        });
		console.log(response.data)
        club.value = response.data;
    } catch (error) {
        console.log("error catched");
        club.value = null;
    }
	Loading.hide();
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


function openEditDialog() {
  manipulatedData.value = JSON.parse(JSON.stringify(club.value));
  editDialog.value = true;
}
function closeEditDialog() {
	manipulatedData.value = null;
  editDialog.value = false;
}

onMounted(() => {
	fetchData();
});


</script>
