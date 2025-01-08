
// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/App.vue
// Description       : The App component is the main component that is displayed when the user logs in. It is used to display the main page of the application.
<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu" icon="menu" />


        <q-toolbar-title>
          APCMS
        </q-toolbar-title>
        <q-space />
        <q-btn v-show="!store.isLoggedIn" @click="$router.push('/register')" flat stretch label="Register"></q-btn>
        <q-btn v-show="!store.isLoggedIn" @click="$router.push('/login')" flat stretch label="Login"></q-btn>
        <q-btn-dropdown v-show="store.isLoggedIn" flat :label="'Hello, ' + store.username">
          <q-list>
            <q-item clickable v-close-popup @click="store.setLogout(); $router.push('/');">
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="openEditDialog()">
              <q-item-section>
                <q-item-label>Edit Profile</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="changePasswordDialog = true">
              <q-item-section>
                <q-item-label>Change Password</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above :mini="miniState" @mouseout="miniState = true"
      @mouseover="miniState = false" :width="250" :breakpoint="500" bordered
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
      <q-list padding>
        <q-item clickable v-if="!store.isLoggedIn" @click="$router.push('/Card')">
          <q-item-section avatar>
            <q-icon name="feed" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Feeds</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-if="store.role == 'Admin'" @click="$router.push('/advisorList/AllAdvisor')">
          <q-item-section avatar>
            <q-icon name="o_supervisor_account" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Manage Advisor</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-if="store.role == 'Admin'" @click="$router.push('/studentList/AllStudent')">
          <q-item-section avatar>
            <q-icon name="groups" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Manage Student</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-if="store.role == 'Admin'" @click="$router.push('/clubList')">
          <q-item-section avatar>
            <q-icon name="o_flag" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Manage Club</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-if="store.role == 'Admin'" @click="$router.push('/badgeList')">
          <q-item-section avatar>
            <q-icon name="o_military_tech" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Point & Bandge</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-if="store.role == 'Admin'" @click="$router.push('/formApplicationList/Admin')">
          <q-item-section avatar>
            <q-icon name="o_pending_actions" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Form Application</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-if="store.role == 'Admin'" @click="$router.push('/eventList')">
          <q-item-section avatar>
            <q-icon name="o_punch_clock" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Events</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-if="store.role == 'Advisor' |  store.role == 'Student'" @click="$router.push('/userDashboard')">
          <q-item-section avatar>
            <q-icon name="speed" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-if="store.role == 'Advisor' |  store.role == 'Student'" @click="$router.push('/Card')">
          <q-item-section avatar>
            <q-icon name="feed" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Feeds</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="store.role == 'Student'" clickable @click="$router.push('/userPostList')">
          <q-item-section avatar>
            <q-icon name="post_add" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Self Created Posts</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="store.role == 'Student'" clickable @click="$router.push('/formApplicationList/Student')">
          <q-item-section avatar>
            <q-icon name="pending_actions" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Application Form</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="store.role == 'Student' && isCommittee" clickable @click="$router.push('/viewClub')">
          <q-item-section avatar>
            <q-icon name="flag" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Manage Club</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="store.role == 'Student' && isCommittee" clickable @click="$router.push('/clubPostList')">
          <q-item-section avatar>
            <q-icon name="post_add" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Created Club Posts</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="store.role == 'Student' && isCommittee"
          clickable @click="$router.push('/formApplicationList/Club')">
          <q-item-section avatar>
            <q-icon name="pending_actions" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Club Application</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="store.role == 'Advisor'" clickable @click="$router.push('/viewClub')">
          <q-item-section avatar>
            <q-icon name="flag" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Manage Club</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="store.role == 'Advisor'" clickable @click="$router.push('/formApplicationList/Advisor')">
          <q-item-section avatar>
            <q-icon name="pending_actions" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Club Application Form</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="store.role == 'Advisor'" clickable @click="$router.push('/clubPostList')">
          <q-item-section avatar>
            <q-icon name="post_add" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Created Club Posts</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-if="store.role == 'Advisor'" @click="$router.push('/badgeList')">
          <q-item-section avatar>
            <q-icon name="o_military_tech" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Point & Bandge</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <RouterView></RouterView>
    </q-page-container>
  </q-layout>


  <q-dialog v-model="editDialog" persistent>
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Update Profile</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeEditDialog()" />
      </q-card-section>
      <q-card-section>
        <q-input filled class="q-mt-md" v-model="manipulatedData.name" label="Name"></q-input>
        <q-select filled class="q-mt-md" v-model="manipulatedData.gender" :options="['Male', 'Female']"
          label="Gender"></q-select>
        <q-input filled class="q-mt-md" v-model="manipulatedData.email" label="Email Address"></q-input>
        <div v-html="error" class="warning text-center q-mt-md"></div>
      </q-card-section>
      <q-card-section class="row justify-end">
        <q-btn flat class="q-ml-md" @click="closeEditDialog()" color="secondary" label="Close"></q-btn>
        <q-btn class="q-ml-md" @click="updateUser()" color="primary" label="Update"></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="changePasswordDialog" persistent>
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Change Password</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeChangePasswordDialog()" />
      </q-card-section>
      <q-card-section>
        <q-input filled class="q-mt-md" v-model="manipulatedData.oldPassword" :type="isPwd1 ? 'password' : 'text'"
          label="Password">
          <template v-slot:append>
            <q-icon :name="isPwd1 ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd1 = !isPwd1" />
          </template>
        </q-input>
        <q-input filled class="q-mt-md" v-model="manipulatedData.newPassword" :type="isPwd2 ? 'password' : 'text'"
          label="Password">
          <template v-slot:append>
            <q-icon :name="isPwd2 ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd2 = !isPwd2" />
          </template>
        </q-input>
        <div v-html="error" class="warning text-center q-mt-md"></div>
      </q-card-section>
      <q-card-section class="row justify-end">
        <q-btn flat class="q-ml-md" @click="closeChangePasswordDialog()" color="secondary" label="Close"></q-btn>
        <q-btn class="q-ml-md" @click="updatePassword()" color="primary" label="Update"
          :disabled="!manipulatedData.oldPassword || !manipulatedData.newPassword"></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from './store/store.js'
import { onMounted, watch } from 'vue'
import { Loading, Notify } from 'quasar'
import StudentService from './services/StudentService.js'
import AuthenticationService from './services/AuthenticationService.js'

const editDialog = ref(false);
const store = useStore();
const miniState = ref(true);
const leftDrawerOpen = ref(true);
const manipulatedData = ref({});
const isCommittee = ref(false);
const error = ref(null);
const changePasswordDialog = ref(false);
const isPwd1 = ref(true);
const isPwd2 = ref(true);

watch(() => store.id, () => {
    fetchData();
});

async function fetchData() {
  if(store.role == 'Student'){
    const student = await StudentService.getStudent({userId: store.id});
    isCommittee.value = student.data.isCommittee;
  }
}

async function openEditDialog(){
  Loading.show();
  try {
    const response = await AuthenticationService.getUser({
      id: store.id
    });
    manipulatedData.value = response.data;
    editDialog.value = true;
  } catch (AxiosError) {
    console.log("error catched: AxiosError");
    manipulatedData.value = {}
  }
  Loading.hide();
}

function closeEditDialog(){
  editDialog.value = false;
  error.value = null
  manipulatedData.value = {}
}

function closeChangePasswordDialog(){
  changePasswordDialog.value = false;
  error.value = null
  manipulatedData.value = {}
}

async function updateUser() {
  Loading.show();
  try {
    console.log(manipulatedData.value)
    const response = await AuthenticationService.updateUser({
      id: manipulatedData.value.id,
      email: manipulatedData.value.email,
      name: manipulatedData.value.name,
      gender: manipulatedData.value.gender,
    });
    store.setUsername(manipulatedData.value.name);
    Notify.create({
      message: response.data.message,
      color: 'positive',
      position: 'top'
    });
    closeEditDialog();
  }
  catch (err) {
        console.log(err)
        error.value = err.response.data.error;
  }
    Loading.hide();
}

async function updatePassword(){
  Loading.show();
  try {
    const response = await AuthenticationService.updatePassword({
      id: store.id,
      oldPassword: manipulatedData.value.oldPassword,
      newPassword: manipulatedData.value.newPassword
    });
    Notify.create({
      message: response.data.message,
      color: 'positive',
      position: 'top'
    });
    closeChangePasswordDialog();
  }
  catch (err) {
    console.log(err)
    error.value = err.response.data.error;
  }
  Loading.hide();

}

onMounted(() => {
  fetchData();
});
</script>


