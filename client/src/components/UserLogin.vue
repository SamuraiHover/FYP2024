// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/components/UserLogin.vue
// Description       : The UserLogin component is the login form for the user. It is used to display the login form for the user.
<template>
    <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-md shadow-2 my_card" bordered>
            <q-card-section class="text-center">
                <div class="text-grey-9 text-h5 text-weight-bold">Sign in</div>
                <div class="text-grey-8">Sign in below to access your account</div>
            </q-card-section>
            <q-card-section>
                <q-input dense outlined v-model="email" label="Email Address"></q-input>
                <q-input dense outlined class="q-mt-md" v-model="password" type="password" label="Password"></q-input>
                <div v-html="error" class="warning text-center q-mt-md"></div>
            </q-card-section>
            <q-card-section>
                <q-btn @click="login" style="border-radius: 8px;" color="primary" rounded size="md" label="Login"
                    no-caps class="full-width"></q-btn>
            </q-card-section>
            <q-card-section class="text-center q-pt-none">
                <div class="text-grey-8">
                    Don't have an account yet?
                    <RouterLink to="/register" class="text-dark text-weight-bold" style="text-decoration: none">
                        Sign up.</RouterLink>
                </div>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService';
import { useStore } from '../store/store.js';
import { Loading, Notify } from 'quasar';


export default {
    data() {
        return {
            email: '',
            password: '',
            error: null
        }
    },
    setup() {
    // Use the store inside setup
    const store = useStore();

    // Expose the store to the template
    return { store };
    },
    methods: {
        async login() {
            try {
                Loading.show();
                const response = await AuthenticationService.login({
                    email: this.email,
                    password: this.password,
                })
                this.store.setLogin(response.data.user.id, response.data.user.name, response.data.user.role, response.data.token);
                Loading.hide();
                Notify.create({
                    message: 'Login successful',
                    color: 'positive',
                    position: 'top',
                    timeout: 2000
                });
                this.$router.push('/');
            }
            catch (err) {
                console.log(err)
                this.error = err.response.data.error;
            }
            Loading.hide();
        }
       
    }
}
</script>


<style scoped>
.warning {
    color: red;
}
</style>