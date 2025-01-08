// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/store/store.js
// Description       : store.js is a store file that stores the user's information.
import { defineStore } from 'pinia';


export const useStore = defineStore({
    id: 'userStore',
    state: () => ({
        id: localStorage.getItem('id') || null,
        username: localStorage.getItem('username') || null,
        role: localStorage.getItem('role') || null,
        jswToken: localStorage.getItem('token') || null,
        isLoggedIn: !!localStorage.getItem('token')

    }),
    getters: {
        getUsername() {
            return this.username;
        },
        getRole() {
            return this.role;
        },
        getId() {
            return this.id;
        },
        getToken() {
            return this.jswToken;
        },
        getIsLoggedIn() {
            return this.isLoggedIn;
        }
    },actions: {
        setLogin(id, username, role, token) {
            this.id = id;
            this.username = username;
            this.role = role;
            this.jswToken = token;
            this.isLoggedIn = true;
            localStorage.setItem('id', id);
            localStorage.setItem('username', username);
            localStorage.setItem('role', role);
            localStorage.setItem('token', token);
        },
        setLogout() {
            this.id = null
            this.username = null
            this.role = null
            this.jswToken = null
            this.isLoggedIn = false;
            localStorage.removeItem('id');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            localStorage.removeItem('token');
        },
        setUsername(username) {
            this.username = username
            localStorage.setItem('username', username);
        }
    }
})
