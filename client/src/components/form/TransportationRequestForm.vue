// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/components/form/TransportationRequestForm.vue
// Description       : The TransportationRequestForm component is the form for the transportation request form. It is used to display the form for the transportation request form.
<template>
    <q-card>
        <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Transportation Request Form</div>
        </q-card-section>
        <q-card-section class="q-pa-md">
                <q-input :readonly="readOnly" type="number" mask="#" bottom-slots filled v-model="manipulatedData.numberOfPpl" label="Number of Poeple"
                    class="col q-mb-md">
                </q-input>
                <q-input :readonly="readOnly" bottom-slots filled v-model="manipulatedData.purpose" label="Purpose of Transportation"
                    class="col q-mb-md">
                </q-input>
                <q-input :readonly="readOnly" bottom-slots filled v-model="manipulatedData.startLoc" label="Start Location"
                    class="col q-mb-md">
                </q-input>
                <q-input :readonly="readOnly" bottom-slots filled v-model="manipulatedData.destinationLoc" label="Destination Location"
                    class="col q-mb-md">
                </q-input>
                <q-input :readonly="readOnly" type="date" filled v-model="manipulatedData.date" label="Date" class="col q-mb-md">
                </q-input>
                <div class="row q-mb-md">
                    <q-input :readonly="readOnly" type="time" filled v-model="manipulatedData.startTime" label="Depart Time"
                        class="col q-mr-sm"
                        :rules="[val => !manipulatedData.endTime || val <= manipulatedData.endTime || 'Start time cannot be after end time']">
                    </q-input>
                    <q-input :readonly="readOnly" type="time" filled v-model="manipulatedData.endTime" label="Return Time" class="col q-ml-sm"
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
    numberOfPpl: '',
    purpose: '',
    startLoc: '',
    destinationLoc: '',
    date: '',
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