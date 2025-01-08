// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/components/form/ClubEventRequestForm.vue
// Description       : The ClubEventRequestForm component is the form for the club event request form. It is used to display the form for the club event request form.
<template>
    <q-card>
        <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Club Event Request Form</div>
        </q-card-section>
        <q-card-section class="q-pa-md">
            <q-input :readonly="readOnly" bottom-slots filled v-model="manipulatedData.eventName" label="Event Name" class="col q-mb-md">
                </q-input>
                <q-input :readonly="readOnly" bottom-slots filled v-model="manipulatedData.eventDescription" label="Event Description"
                    class="col q-mb-md">
                </q-input>
                <div class="row q-mb-md">
                    <q-input :readonly="readOnly" type="date" filled v-model="manipulatedData.startDate" label="Start Date"
                        class="col q-mr-sm"
                        :rules="[val => !manipulatedData.endDate || val <= manipulatedData.endDate || 'Start date cannot be after end date']">

                    </q-input>
                    <q-input :readonly="readOnly" type="date" filled v-model="manipulatedData.endDate" label="End Date"
                        class="col col q-ml-sm"
                        :rules="[val => !manipulatedData.startDate || val >= manipulatedData.startDate || 'End date cannot be before start date']">
                    </q-input>
                </div>
                <div class="row q-mb-md">
                    <q-input :readonly="readOnly" type="time" filled v-model="manipulatedData.startTime" label="Start Time"
                        class="col q-mr-sm"
                        :rules="[val => !manipulatedData.endTime || val <= manipulatedData.endTime || 'Start time cannot be after end time']">
                        <template v-slot:hint>
                            Required
                        </template>
                    </q-input>
                    <q-input :readonly="readOnly" type="time" filled v-model="manipulatedData.endTime" label="End Time" class="col q-ml-sm"
                        :rules="[val => !manipulatedData.startTime || val >= manipulatedData.startTime || 'End time cannot be before start time']">
                    </q-input>
                </div>
        </q-card-section>
    </q-card>
</template>

<script setup>
import { ref, defineExpose, defineProps, defineEmits, onMounted} from 'vue';

defineProps(['readOnly']);
const emit = defineEmits(['mounted']);

const manipulatedData = ref({
    eventName: '',
    eventDescription: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: ''
})

function setData (data) {
    manipulatedData.value = data;
}

defineExpose({
    manipulatedData,
    setData
})
onMounted(() => {
    emit('mounted')
})

</script>