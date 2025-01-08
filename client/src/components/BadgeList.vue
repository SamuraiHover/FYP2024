// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/components/BadgeList.vue
// Description       : The BadgeList component is used to display the list of badges in the system.
<template>
    <div class="q-pa-md">
        <q-table bordered title="Badges" :rows="tableData" :columns="qTableHeader" row-key="id" selection="single"
            v-model:selected="selected" @update:selected="togglerFunction()"
            no-data-label="I didn't find anything for you" :filter="filter" :filter-method="filterData">
            <template v-slot:top>
                <div class="col-2 q-table__title">Badge List</div>
                <q-space />
                <q-btn class="q-ml-md" color="green" label="Add" @click="openAddDialog()" />
                <q-btn class="q-ml-md" color="red" label="Delete" :disabled="toggler" @click="BadgeDelete()" />
                <q-btn class="q-ml-md" label="Edit" :disabled="toggler" @click="openEditDialog()" />
                <q-btn class="q-ml-md" label="Assign Badge" :disabled="toggler" @click="openAssignDialog()" />
                <q-input v-model="filter" dense outlined input-class="text-left" class="q-ml-md" placeholder="Search">
                    <template v-slot:append>
                        <q-icon v-if="filter === ''" name="search" />
                        <q-icon v-else name="clear" class="cursor-pointer" @click="filter = ''" />
                    </template>
                </q-input>
            </template>
            <template v-slot:body-cell-badgeIcon="props">
                <q-td :props="props">
                    <q-icon :name="props.row.badgeIcon" :style="{ color: props.row.badgeColor }" size="56px" />
                </q-td>
            </template>
        </q-table>
    </div>

    <q-dialog v-model="assignDialog" persistent :maximized="true" transition-show="slide-down"
        transition-hide="slide-up">
        <q-card>
            <q-card-section class="row items-center q-pb-none">
                <q-btn icon="close" flat round dense @click="closeAssignDialog()" />
            </q-card-section>
            <q-card-section class="q-pa-md" style="width:450px">
                <q-item>
                    <q-item-section> <q-icon :name="manipulatedData.badgeIcon" :style="{ color: manipulatedData.badgeColor }"
                            size="56px" /></q-item-section>
                </q-item>
                <q-item>
                    <q-item-section class="text-weight-bold">Badge Name:</q-item-section>
                    <q-item-section>{{manipulatedData.badgeName}}</q-item-section>
                </q-item>
                <q-item>
                    <q-item-section class="text-weight-bold">Points:</q-item-section>
                    <q-item-section>{{manipulatedData.badgePoints}}</q-item-section>
                </q-item>
            </q-card-section>
            <q-card-section class="">
                <div class="q-pa-md">
                    <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary"
                        align="left" narrow-indicator>
                        <q-tab name="assigned" label="assigned" @click="refresh()" />
                        <q-tab name="unassinged" label="unassigned" />
                    </q-tabs>
                    <q-tab-panels v-model="tab" animated>
                        <q-tab-panel name="assigned" style="padding: 0;">
                            <StudentList :layoutType="'StudentBadge'" :inputData="manipulatedData" />
                        </q-tab-panel>
                        <q-tab-panel name="unassinged" style="padding: 0;">
                            <StudentList :layoutType="'StudentBadgeUnassigned'" :inputData="manipulatedData" />
                        </q-tab-panel>
                    </q-tab-panels>
                </div>
            </q-card-section>
            <q-card-section class="row justify-end">
                <q-btn class="q-ml-md" label="Close" color="secondary" flat @click="closeAssignDialog()" />
            </q-card-section>
        </q-card>
    </q-dialog>

    <q-dialog v-model="addDialog" persistent>
        <q-card style="">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">Add New Badge</div>
                <q-space />
                <q-btn icon="close" flat round dense @click="closeAddDialog()" />
            </q-card-section>
            <q-card-section class="q-pa-md">
                <q-input filled v-model="manipulatedData.badgeName" label="Badge Name" class="col q-mb-md">
                </q-input>
                <q-input type="number" filled v-model="manipulatedData.badgePoints" label="Points" class="col q-mb-md">
                </q-input>
                <q-carousel arrows v-model="manipulatedData.badgeIcon" transition-prev="slide-right"
                    transition-next="slide-left" animated control-color="primary" class="rounded-borders q-pa-md"
                    style="border: 1px solid #000; width: 200px; height: 150px;">
                    <q-carousel-slide v-for="(name, index) in iconNameArr" :key="index" :name="name"
                        class="column no-wrap flex-center">
                        <q-icon :name="name" :style="{ color: manipulatedData.badgeColor }" size="56px" />
                    </q-carousel-slide>
                </q-carousel>
                <div class="text-center">
                    {{ iconNameArr.indexOf(manipulatedData.badgeIcon) + 1 }}/{{ iconNameArr.length }}
                </div>
                <q-color v-model="manipulatedData.badgeColor" no-header-tabs no-footer class="my-picker q-pt-md q-pb-md"
                    flat />
            </q-card-section>
            <q-card-section class="row justify-between">
                <q-btn class="q-ml-md" label="Close" color="secondary" flat @click="closeAddDialog()" />
                <q-btn class="q-ml-md" label="Add" color="green" @click="BadgeAdd()" 
                :disabled="!manipulatedData.badgeName || !manipulatedData.badgePoints"/>
            </q-card-section>
        </q-card>
    </q-dialog>

    <q-dialog v-model="editDialog" persistent>
        <q-card style="width: 400px">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">Update Badge</div>
                <q-space />
                <q-btn icon="close" flat round dense @click="closeEditDialog()" />
            </q-card-section>
            <q-card-section class="q-pa-md">
                <q-input filled v-model="manipulatedData.badgeName" label="Badge Name" class="col q-mb-md">
                </q-input>
                <q-input type="number" filled v-model="manipulatedData.badgePoints" label="Points" class="col q-mb-md">
                </q-input>
                <q-carousel arrows v-model="manipulatedData.badgeIcon" transition-prev="slide-right"
                    transition-next="slide-left" animated control-color="primary" class="rounded-borders q-pa-md"
                    style="border: 1px solid #000; width: 200px; height: 150px;">
                    <q-carousel-slide v-for="(name, index) in iconNameArr" :key="index" :name="name"
                        class="column no-wrap flex-center">
                        <q-icon :name="name" :style="{ color: manipulatedData.badgeColor }" size="56px" />
                    </q-carousel-slide>
                </q-carousel>
                <div class="text-center">
                    {{ iconNameArr.indexOf(manipulatedData.badgeIcon) + 1 }}/{{ iconNameArr.length }}
                </div>
                <q-color v-model="manipulatedData.badgeColor" no-header-tabs no-footer class="my-picker q-pt-md q-pb-md"
                    flat />
            </q-card-section>
            <q-card-section class="row justify-between">
                <q-btn class="q-ml-md" label="Close" color="secondary" flat @click="closeEditDialog()" />
                <q-btn class="q-ml-md" label="Save" color="green" @click="BadgeUpdate()" 
                :disabled="!manipulatedData.badgeName || !manipulatedData.badgePoints"/>
            </q-card-section>
        </q-card>
    </q-dialog>


</template>

<script setup>

import BadgeService from '../services/BadgeService';
import StudentList from './StudentList.vue';
import { ref } from 'vue';
import { toRaw } from 'vue';
import { onMounted } from 'vue';
import { Notify } from 'quasar';


const filter = ref("");
const qTableHeader = [
	{ name: 'badgeName', required: true, label: 'badgeName', align: 'left', field: 'badgeName', sortable: true },
	{ name: 'badgeIcon', label: 'Badge', field: 'badgeIcon', align: 'center' },
	{ name: 'badgePoints', label: 'Points', field: 'badgePoints', align: 'center', sortable: true},
];

var tableData = ref([]);
const selected= ref([]);
const tab= ref('assigned');
const toggler= ref(true);
const editDialog= ref(false);
const addDialog= ref(false);
const assignDialog= ref(false);

const manipulatedData= ref(null);
const iconNameArr= ref(['military_tech', 'workspace_premium', 'fas fa-award', 'fas fa-trophy', 'fas fa-medal', 'mdi-seal-variant', 'mdi-seal'])

function filterData(rows, term) {
	const filteredItems = tableData.value.filter(item => `${item.badgeName} || ${item.badgePoints}`.toLowerCase().includes(term.toLowerCase()));
	return filteredItems;
}
async function fetchData() {
	try {
		const BadgeList = await BadgeService.getBadges();
		tableData.value = BadgeList.data;

	}catch(AxiosError) {
		console.log("error catched");

		tableData.value = [];
	}
}
async function BadgeDelete() {
	try {
		const response = await BadgeService.deleteBadge({
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

async function BadgeAdd() {
	try {
		const response = await BadgeService.addBadge(toRaw(manipulatedData.value));
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
async function BadgeUpdate() {
	try {
		const response = await BadgeService.updateBadge(toRaw(manipulatedData.value));
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
  manipulatedData.value = {};
  manipulatedData.value.badgeIcon = "military_tech";
  manipulatedData.value.badgeColor = '#000000';
  addDialog.value = true;
}

function closeAddDialog() {
	manipulatedData.value = null;
	addDialog.value = false;
}

function openAssignDialog() {
    manipulatedData.value = JSON.parse(JSON.stringify(selected.value[0]));
    assignDialog.value = true;
}

function closeAssignDialog() {
    manipulatedData.value = null;
    assignDialog.value = false;
    refresh();
}

onMounted(() => {
	fetchData();
});


</script>
