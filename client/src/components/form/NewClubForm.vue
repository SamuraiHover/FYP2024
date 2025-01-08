// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/components/form/NewClubForm.vue
// Description       : The NewClubForm component is the form for the new club form. It is used to display the form for the new club form.
<template>
    <q-card>
        <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">New Club Form</div>
            <q-space />
            <q-btn icon="close" flat round dense @click="closeAddDialog()" />
        </q-card-section>
        <q-card-section class="q-pa-md">
            <q-input :readonly="readOnly" filled v-model="manipulatedData.clubName" label="Club Name" class="col q-mb-md" />
            <q-input :readonly="readOnly" filled v-model="manipulatedData.clubDescription" label="Club Description" class="col q-mb-md" />
            <q-input :readonly="readOnly" filled v-model="manipulatedData.clubPurpose" label="Club Purpose" class="col q-mb-md" />
            <q-input :readonly="readOnly" filled v-model="manipulatedData.clubAdvisor" label="Advisor" class="col q-mb-md" />
        </q-card-section>
    </q-card>
</template>

<script setup>
import { ref, defineExpose, defineProps, defineEmits, onMounted} from 'vue';

defineProps(['readOnly']);
const emit = defineEmits(['mounted']);

const manipulatedData = ref({
    clubName: '',
    clubDescription: '',
    clubPurpose: '',
    clubAdvisor: ''
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