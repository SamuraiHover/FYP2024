// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/components/StudentList.vue
// Description       : The StudentList component is used to display the list of students in the system. It is used to display the list of students in the system.
<template>
	<q-tabs v-show="props.layoutType == 'ClubMember'" v-model="tab" dense class="text-grey" active-color="primary"
		indicator-color="primary" align="left" narrow-indicator>
		<q-tab name="students" label="Members" @click="refresh()" />
		<q-tab name="committee" label="Committee" />
	</q-tabs>

	<q-tab-panels v-model="tab" animated>
		<q-tab-panel name="students">
			<q-table bordered :title="title" :rows="tableData" :columns="qTableHeader()" :row-key="rowkey"
				selection="single" v-model:selected="selected" @update:selected="togglerFunction()"
				no-data-label="I didn't find anything for you" :filter="filter" :filter-method="filterData">
				<template v-slot:top>
					<div class="col-2 q-table__title">{{ title }}</div>
					<q-space />
					<!--LayoutType: ClubMemberOnly-->
					<q-btn class="q-ml-md" color="green" label="Add" @click="addStudentToClub_Dialog = true"
						v-show="props.layoutType == 'ClubMemberOnly'" />
					<q-btn class="q-ml-md" color="red" label="Remove" :disabled="toggler" @click="RemoveFromClub()"
						v-show="props.layoutType == 'ClubMemberOnly'" />
					<!--LayoutType: ClubMember-->
					<q-btn class="q-ml-md" color="green" label="Add" @click="addStudentToClub_Dialog = true"
						v-show="props.layoutType == 'ClubMember'" />
					<q-btn class="q-ml-md" color="red" label="Remove" :disabled="toggler" @click="RemoveFromClub()"
						v-show="props.layoutType == 'ClubMember'" />
					<q-btn class="q-ml-md" color="grey" label="Add To Committee" :disabled="toggler"
						@click="AddToCommittee()" v-show="props.layoutType == 'ClubMember'" />
					<!--LayoutType: ClubCommittee-->
					<q-btn class="q-ml-md" color="red" label="Remove" :disabled="toggler" @click="RemoveFromCommittee()"
						v-show="props.layoutType == 'ClubCommittee'" />
					<!--LayoutType: AllStudent-->
					<q-btn class="q-ml-md" label="Info" :disabled="toggler" @click="openInfoDialog()"
						v-show="props.layoutType == 'AllStudent'" />
					<!--LayoutType: AllNonClubMember-->
					<q-btn class="q-ml-md" color="green" label="Add" @click="addStudentToClub()"
						v-show="props.layoutType == 'AllNonClubMember'" />
					<!--LayoutType: StudentBadge-->
					<q-btn class="q-ml-md" color="red" label="Unassign" @click="unassignBadge()" :disabled="toggler"
						v-show="props.layoutType == 'StudentBadge'" />
					<!--LayoutType: StudentBadgeUnassigned-->
					<q-btn class="q-ml-md" color="green" label="Assign" @click="assignBadge()" :disabled="toggler"
						v-show="props.layoutType == 'StudentBadgeUnassigned'" />
					<q-input v-model="filter" dense outlined input-class="text-left" class="q-ml-md"
						placeholder="Search">
						<template v-slot:append>
							<q-icon v-if="filter === ''" name="search" />
							<q-icon v-else name="clear" class="cursor-pointer" @click="filter = ''" />
						</template>
					</q-input>
				</template>
			</q-table>
		</q-tab-panel>
		<q-tab-panel name="committee" style="padding: 0;">
			<StudentList :layoutType="'ClubCommittee'" :inputData="props.inputData" />
		</q-tab-panel>
	</q-tab-panels>

	<q-dialog v-model="addStudentToClub_Dialog" persistent>
		<q-card>
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6">Add Student To Club</div>
				<q-space />
				<q-btn icon="close" flat round dense @click="closeAddStudentToClub_Dialog()" />
			</q-card-section>
			<q-card-section class="q-pa-md">
				<StudentList :layoutType="'AllNonClubMember'" :inputData="props.inputData" />
			</q-card-section>
			<q-card-section class="row justify-end">
				<q-btn class="q-ml-md" label="Close" color="secondary" flat @click="closeAddStudentToClub_Dialog()" />

			</q-card-section>
		</q-card>
	</q-dialog>

	<q-dialog v-model="infoDialog" persistent :maximized="true" transition-show="slide-down" transition-hide="slide-up">
		<q-card>
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6 text-weight-bold">Student Info</div>
				<q-space />
				<q-btn icon="close" flat round @click="closeInfoDialog()" />
			</q-card-section>
			<q-card-section class="q-pa-md" style="width:450px">
				<q-item>
					<q-item-section class="text-weight-bold">Name:</q-item-section>
					<q-item-section>{{student.User.name}}</q-item-section>
				</q-item>
				<q-item>
					<q-item-section class="text-weight-bold">Email:</q-item-section>
					<q-item-section>{{student.User.email}}</q-item-section>
				</q-item>
				<q-item>
					<q-item-section class="text-weight-bold">Gender:</q-item-section>
					<q-item-section>{{student.User.gender}}</q-item-section>
				</q-item>
				<q-item v-if="student.Club">
					<q-item-section class="text-weight-bold">Club:</q-item-section>
					<q-item-section>{{student.Club? student.Club.clubName: 'N/A'}}</q-item-section>
				</q-item>
				<q-item>
					<q-item-section class="text-weight-bold">TP Number:</q-item-section>
					<q-item-section>{{ student.tpNum }}</q-item-section>
				</q-item>
			</q-card-section>
			<q-card-section v-if='student.StudentBadges'>
				<q-card class="my-card" style="display: flex;" v-for="(badge, index) in student.StudentBadges "
					:key="index">
					<q-card-section>
						<q-icon :name="badge.Badge.badgeIcon" :style="{ color: badge.Badge.badgeColor }" size="50px"
							class="q-mr-sm" />
					</q-card-section>
					<q-card-section>
						<div class="text-h6">{{ badge.Badge.badgeName }}</div>
						<div class="text-subtitle2">{{ badge.Badge.badgePoints }} points</div>
					</q-card-section>
				</q-card>
			</q-card-section>
			<q-card-section class="row justify-end">
				<q-btn class="q-ml-md" label="Close" color="secondary" flat @click="closeInfoDialog()" />
			</q-card-section>
		</q-card>
	</q-dialog>


</template>

<script setup>

import ClubService from '@/services/ClubService';
import StudentService from '@/services/StudentService';
import BadgeService from '@/services/BadgeService';
import { ref } from 'vue';
import { toRaw } from 'vue';
import { onMounted } from 'vue';
import { Loading, Notify } from 'quasar';
import { useStore } from '../store/store.js'

const props = defineProps(["layoutType" , "inputData"]);
/*
LayoutType: ClubMemberOnly
inputData: selected Club

LayoutType: ClubMember
inputData: selected Club

LayoutType: ClubCommittee
inputData: selected Club

LayoutType: AllStudent
inputData: null

//only for fetching students
LayoutType: AllNonClubMember
inputData: selected Club

LayoutType: StudentBadge
LayoutType: StudentBadgeUnassigned


*/
const tab = ref('students');
const title = ref('');
const rowkey = ref('');
const filter = ref("");
const infoDialog = ref(false);
const qTableHeader = () =>{
	if(props.layoutType == "ClubMember" || props.layoutType == "ClubMemberOnly"){
		console.log(props.layoutType);
		title.value = 'Club Members';
		rowkey.value = 'id';
		console.log("ClubMember");
		return [
			{ name: 'id', label: 'ID', field: row => row.id, align: 'left', sortable: true},
			{ name: 'tpNum', label:'TP Number', field: row => row.tpNum, align: 'left', sortable: true},
			{ name: 'name', required: true, label: 'Name', align: 'left', field: row => row.User.name, format: val => `${val}`, sortable: true },
			{ name: 'email', label: 'Email', align: 'left', field: row => row.User.email },
			{ name: 'gender', label: 'Gender', align: 'center',field: row => row.User.gender },
			{ name: 'isCommittee', label: '', field: row => row.isCommittee ? 'Committee' : 'Member'}
		];
	}
	else if(props.layoutType == "AllStudent" || props.layoutType == "StudentBadge" || props.layoutType == "StudentBadgeUnassigned"){
		title.value = 'All Students';
		rowkey.value = 'id';
		return [
			{ name: 'id', label: 'ID', field: row => row.id, align: 'left', sortable: true},
			{ name: 'tpNum', label:'TP Number', field: row => row.tpNum, align: 'left', sortable: true},
			{ name: 'name', required: true, label: 'Name', align: 'left', field: row => row.User.name, format: val => `${val}`, sortable: true },
			{ name: 'email', label: 'Email', field: row => row.User.email },
			{ name: 'gender', label: 'Gender', field: row => row.User.gender },
			{ name: 'club', label: 'Club', field: row => row.Club? row.Club.clubName : 'N/A' }
		];
	}
	else if(props.layoutType == "AllNonClubMember" || props.layoutType == "ClubCommittee"){
		title.value = 'Students';
		rowkey.value = 'id';
		return [
			{ name: 'id', label: 'ID', field: row => row.id, align: 'left', sortable: true},
			{ name: 'tpNum', label:'TP Number', field: row => row.tpNum, align: 'left', sortable: true},
			{ name: 'name', required: true, label: 'Name', align: 'left', field: row => row.User.name, format: val => `${val}`, sortable: true },
			{ name: 'email', label: 'Email', field: row => row.User.email},
			{ name: 'gender', label: 'Gender', field: row => row.User.gender }
		];
	}
	else{
		console.log("error catched: invalid layoutType");
		return []
	}
}

var tableData = ref([]);
const selected= ref([]);
const toggler= ref(true);
const addStudentToClub_Dialog= ref(false);
const store = useStore();
const manipulatedData= ref([]);
const club = ref(null);
const student = ref(null);



function filterData(rows, term) {
	
	if (term.trim() === '') return rows;
	if(props.layoutType == "ClubMember" || props.layoutType == "AllNonClubMember" || props.layoutType == "ClubCommittee" || props.layoutType == "ClubMemberOnly"){
		const filteredItems = tableData.value.filter(item => `${item.User.name} || ${item.tpNum} || ${item.User.email} || ${item.User.gender}`.toLowerCase().includes(term.toLowerCase()));
		return filteredItems;
	}
	else if(props.layoutType == "AllStudent" || props.layoutType == "StudentBadge" || props.layoutType == "StudentBadgeUnassigned"){
		const filteredItems = tableData.value.filter(item => `${item.User.name} || ${item.tpNum}|| ${item.User.email} || ${item.User.gender} || ${item.Club? item.Club.clubName: item.Club}`.toLowerCase().includes(term.toLowerCase()));
		return filteredItems;
	}
	else{
		console.log("error catched: invalid layoutType");
		return [];
	}
}

async function fetchData() {
	Loading.show();
	try {
		if (props.layoutType == "ClubMember" || props.layoutType == "ClubMemberOnly") {
			const studentList = await ClubService.getClubStudents(
				{ clubId: props.inputData.id }
			);
			tableData.value = studentList.data;
		}
		else if (props.layoutType == "ClubCommittee") {
			const studentList = await ClubService.getClubCommittee(
				{ clubId: props.inputData.id }
			);
			tableData.value = studentList.data;
		}
		else if (props.layoutType == "AllStudent") {
			const studentList = await StudentService.getAllStudents();
			if (store.role == 'Advisor') {
				const response = await ClubService.getClub({
					id: store.id,
					role: store.role
				});
				console.log(response.data)
				club.value = response.data;
				if(!club.value){
					return tableData.value = {};
				}
				tableData.value = studentList.data.filter(student => student.clubId === club.value.id);
			}
			else{
				tableData.value = studentList.data;
			}
		}
		else if (props.layoutType == "AllNonClubMember") {
			const studentList = await StudentService.getNonClubStudents();
			tableData.value = studentList.data;
		}
		else if (props.layoutType == "StudentBadge") {
			const studentList = await StudentService.getStudentBadgeAssignedList(
				{ badgeId: props.inputData.id}
			);
			if (store.role == 'Advisor') {
				const response = await ClubService.getClub({
					id: store.id,
					role: store.role
				});
				console.log(response.data)
				club.value = response.data;
				if(!club.value){
					return tableData.value = {};
				}
				tableData.value = studentList.data.filter(student => student.clubId === club.value.id);
			}
			else{
				tableData.value = studentList.data;
			}
			
		}
		else if (props.layoutType == "StudentBadgeUnassigned") {
			const studentList = await StudentService.getStudentBadgeUnassignedList(
				{ badgeId: props.inputData.id}
			);
			if (store.role == 'Advisor') {
				const response = await ClubService.getClub({
					id: store.id,
					role: store.role
				});
				console.log(response.data)
				club.value = response.data;
				if(!club.value){
					return tableData.value = {};
				}
				tableData.value = studentList.data.filter(student => student.clubId === club.value.id);
			}
			else{
				tableData.value = studentList.data;
			}
		}
		else {
			tableData.value = [];
			console.log("error catched: invalid layoutType");
		}
	} catch (AxiosError) {
		console.log("error catched: AxiosError");
		tableData.value = [];
	}
	Loading.hide();
}

async function RemoveFromClub() {
	if(store.role == 'Student' && selected.value[0].isCommittee){
		Notify.create({
			message: 'You are not authorized to remove a committee',
			color: 'negative',
			position: 'top'
		});
		return;
	}
	try {
		await ClubService.removeStudentFromClub({
			id: toRaw(selected.value)[0].id
		});
		refresh();
		Notify.create({
			message: 'Student Deleted',
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

async function openInfoDialog() {
	Loading.show();
	try{
		const response = await StudentService.getStudent(
			{ userId: selected.value[0].userId }
		);
		student.value = response.data;
		infoDialog.value = true;
	}
	catch(err){
		console.log(err);
	}
	Loading.hide();
}
function closeInfoDialog() {
		infoDialog.value = false;
		student.value = false;
}
function closeAddStudentToClub_Dialog() {
	addStudentToClub_Dialog.value = false;
	refresh();
}

async function addStudentToClub(){
	try {
		Loading.show();
		selected.value[0].clubId = props.inputData.id;

		await ClubService.addStudentToClub(toRaw(selected.value[0]));
		refresh();
		Notify.create({
			message: 'Student Added To Club',
			color: 'blue',
			position: 'top'
		});
	}
	catch (err) {
		console.log(err);
		manipulatedData.value.clubId = null;
		const errorMsg = err.response ? err.response.data.error : 'An error occurred';
		Notify.create({
			message: errorMsg,
			color: 'negative',
			position: 'top'
		});
	}
	Loading.hide();
}

async function AddToCommittee(){
	try {
		Loading.show();
		selected.value[0].clubId = props.inputData.id;
		var response = await ClubService.addStudentToCommittee(toRaw(selected.value[0]));
		refresh();
		Notify.create({
			message: response.data.message,
			color: 'blue',
			position: 'top'
		});
	}
	catch (err) {
		console.log(err);
		manipulatedData.value.clubId = null;
		const errorMsg = err.response ? err.response.data.error : 'An error occurred';
		Notify.create({
			message: errorMsg,
			color: 'negative',
			position: 'top'
		});
	}
	Loading.hide();
}

async function RemoveFromCommittee(){
	try {
		Loading.show();
		selected.value[0].clubId = props.inputData.id;
		var response = await ClubService.removeStudentFromCommittee(toRaw(selected.value[0]));
		refresh();
		Notify.create({
			message: response.data.message,
			color: 'blue',
			position: 'top'
		});
	}
	catch (err) {
		console.log(err);
		manipulatedData.value.clubId = null;
		const errorMsg = err.response ? err.response.data.error : 'An error occurred';
		Notify.create({
			message: errorMsg,
			color: 'negative',
			position: 'top'
		});
	}
	Loading.hide();
}

async function assignBadge(){
	try {
		Loading.show();
		var response = await BadgeService.assignBadge({
			studentId: toRaw(selected.value)[0].id,
			badgeId: props.inputData.id
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
		manipulatedData.value.clubId = null;
		const errorMsg = err.response ? err.response.data.error : 'An error occurred';
		Notify.create({
			message: errorMsg,
			color: 'negative',
			position: 'top'
		});
	}
	Loading.hide();
}

async function unassignBadge(){
	try {
		Loading.show();
		var response = await BadgeService.unassignBadge({
			studentId: toRaw(selected.value)[0].id,
			badgeId: props.inputData.id
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
		manipulatedData.value.clubId = null;
		const errorMsg = err.response ? err.response.data.error : 'An error occurred';
		Notify.create({
			message: errorMsg,
			color: 'negative',
			position: 'top'
		});
	}
	Loading.hide();

}




onMounted(() => {
	fetchData();
	
});

</script>
