// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/components/UserDashboard.vue
// Description       : The UserDashboard component is the dashboard for the user. It is used to display the user's information and events.
<template>
    <div class="q-pa-md row items-start q-gutter-md" v-if="user">
        <q-card v-if="store.role == 'Student'" class="my-card" style="display: flex;">
            <q-card-section>
                <div class="text-h6">{{ user.User.name }} <q-icon name="male" color="blue" size="md"
                        v-if="user.User.gender == 'Male'"></q-icon><q-icon name="female" color="pink" size="md"
                        v-else></q-icon></div>
                <div class="text-subtitle2">{{ user.User.email }} | {{ user.tpNum }}</div>
                <div v-if="user.Club" class="text-subtitle2 text-teal">{{ user.Club.clubName }} | {{ user.isCommittee? "Committee": "Member" }}</div>
            </q-card-section>
            <q-card-section style="display: flex; flex-direction: row; align-items: center;">
                <q-circular-progress show-value class="text-teal text-bold q-ma-md" :value="points" :max="500" size="75px" style="margin: 0" 
                    :thickness="0.5" track-color="grey-3" color="teal" >
                    {{ level }}
                </q-circular-progress>
            </q-card-section>
            <q-separator vertical inset size="2px" />
            <q-card-section style="display: flex; flex-direction: row; align-items: center;">
                <q-icon v-for="(badge, index) in user.StudentBadges.slice(0, 5) " :key="index"
                    :name="badge.Badge.badgeIcon" :style="{ color: badge.Badge.badgeColor }" size="40px"
                    class="q-mr-sm">
                    <q-popup-proxy transition-show="flip-up" transition-hide="flip-down">
                        <q-banner class="bg-grey text-white">
                            <div class="text-subtitle2">{{ badge.Badge.badgeName }}</div>
                            <div class="text">Points: {{ badge.Badge.badgePoints }}</div>
                        </q-banner>
                    </q-popup-proxy>
                </q-icon>
                <q-button v-if="user.StudentBadges.length > 5" class="q-mr-sm" style="font-size: 30px; font-weight:bolder; color:"
                    @click="showBadgesDialog = true">
                    +{{ user.StudentBadges.length - 5 }}
                </q-button>
            </q-card-section>
        </q-card>
        <q-card v-if="store.role == 'Advisor'" class="my-card" style="display: flex;">
            <q-card-section>
                <div class="text-h6">{{ user.User.name }} <q-icon name="male" color="blue" size="md"
                        v-if="user.User.gender == 'Male'"></q-icon><q-icon name="female" color="pink" size="md"
                        v-else></q-icon></div>
                <div class="text-subtitle2">{{ user.User.email }}</div>
                <div v-if="user.Club" class="text-subtitle2 text-teal">{{ user.Club.clubName }} | Advisor </div>
            </q-card-section>
        </q-card>
    </div>
    <div class="q-pa-md row items-start q-gutter-md" v-if="user">
        <q-card class="my-card">
            <q-card-section style="width:600px">
                <EventCalendar></EventCalendar>
            </q-card-section>
        </q-card>
    </div>

    <q-dialog v-model="showBadgesDialog">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <span class="text-h6">Badges</span>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-card class="my-card" style="display: flex;" v-for="(badge, index) in user.StudentBadges " :key="index">
            <q-card-section>
                <q-icon :name="badge.Badge.badgeIcon" :style="{ color: badge.Badge.badgeColor }" size="50px"
                    class="q-mr-sm"/>
            </q-card-section>
            <q-card-section>
                <div class="text-h6">{{ badge.Badge.badgeName }}</div>
                <div class="text-subtitle2">{{ badge.Badge.badgePoints }} points</div>
            </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
  </q-dialog>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from '../store/store.js'
import StudentService from '../services/StudentService.js'
import AdvisorService from '../services/AdvisorService.js'
import EventCalendar from './EventCalendar.vue'
const store = useStore();
const showBadgesDialog = ref(false);
const user = ref(null);
const points = ref(0);
const level = ref(0);
async function fetchData() {
    try{
        if (store.role == 'Student') {
            const response = await StudentService.getStudent(
                {userId: store.id}
            );
            user.value = response.data;
            let totalPoints  = 0
            let pointsPerLevel = 500;
            for (let i = 0; i < user.value.StudentBadges.length; i++) {
                totalPoints += user.value.StudentBadges[i].Badge.badgePoints;
                level.value = Math.floor(totalPoints / pointsPerLevel);
                points.value = totalPoints % pointsPerLevel;
            }
        }
        if(store.role == 'Advisor'){
            const response = await AdvisorService.getAdvisor(
                {userId: store.id}
            );
            user.value = response.data;
        }
    }catch(AxiosError){
        console.log(AxiosError);
        user.value = null;
    }
}

onMounted(() => {
    fetchData();
});

</script>