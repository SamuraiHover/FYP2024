// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/components/UserRegister.vue
// Description       : The UserRegister component is the form for the user registration form. It is used to display the form for the user registration form.
<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2 ">
        <q-card class="q-pa-md shadow-2 my_card" bordered>
          <q-card-section class="text-center">
            <div class="text-grey-9 text-h5 text-weight-bold">Register</div>
            <div class="text-grey-8">Register below to create an account</div>
          </q-card-section>
          <q-card-section>
            <q-input dense outlined class="q-mt-md" v-model="name" label="Name"></q-input>
            <q-select class="q-mt-md" v-model="gender" :options="['Male', 'Female']" label="Gender" outlined
              dense></q-select>
            <q-input dense outlined class="q-mt-md" v-model="tpNum" label="TP Number" prefix="TP"></q-input>
            <q-input dense outlined class="q-mt-md" v-model="email" label="Email Address"></q-input>
            <q-input dense outlined class="q-mt-md" v-model="password" :type="isPwd ? 'password' : 'text'" label="Password">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwd = !isPwd" />
              </template>
            </q-input>
            <div v-html="error" class="warning text-center q-mt-md"></div>
          </q-card-section>
          <q-card-section>
            <q-btn @click="register" style="border-radius: 8px;" color="primary" rounded size="md" label="Register"
              no-caps class="full-width"></q-btn>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>

</template>

<script>
import AuthenticationService from '@/services/AuthenticationService';
export default {
  data() {
    return {
      email: '',
      password: '',
      name: '',
      gender: '',
      tpNum:'',
      error: null,
      isPwd: true
    }
  },
  methods: {
    async register() {
      try {
        await AuthenticationService.register({
          email: this.email,
          password: this.password,
          name: this.name,
          role: "Student",
          gender: this.gender,
          tpNum: "TP" + this.tpNum
        })
        this.$router.push('login');
      }
      catch (err) {
        console.log(err)
        this.error = err.response.data.error;
      }
    }
  }
}
</script>


<style scoped>
.warning {
  color: red;
}
</style>
