// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/components/PostCard.vue
// Description       : The PostCard component is the card for the post. It is used to display the post card.
<template>
    <q-card class="my-card" style="width:400px" v-if="post">
        <q-item>
            <q-item-section>
                <q-item-label v-if="post.Club">{{ post.Club.clubName }}</q-item-label>
                <q-item-label v-else>{{ post.User.name }}</q-item-label>
                <q-item-label caption>{{ new Date(post.postDate).toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }) }}</q-item-label>
            </q-item-section>
        </q-item>
        <img v-if="post.imageUrl" :src="baseURL + post.imageUrl" style="width:100%; height:auto">
        <q-card-section>
            <div class="row justify-between items-center">
                <q-item-label style="font-weight: bold;">{{ post.postTitle }}</q-item-label>
                <q-card-actions v-if="store.isLoggedIn">
                    <transition name="bounce" mode="out-in">
                        <q-btn v-if="!like" flat round color="red" icon="favorite_border" @click="likePost" />
                        <q-btn v-else flat round color="red" icon="favorite_solid" @click="unlikePost" />
                    </transition>
                </q-card-actions>
            </div>
            <q-item-label v-html="post.postContent"></q-item-label>
            <q-item-label >{{ likes }} likes</q-item-label>
        </q-card-section>
    </q-card>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';
import {baseURL} from '../services/Api.js';
import PostService from '../services/PostService';
import { Notify } from 'quasar';
import {useStore} from '../store/store';

const like = ref(false);

const likes = ref(0);

const props = defineProps(['post']);

const store = useStore();

async function likePost(){
    try{
        const response = await PostService.likePost({
            postId: props.post.id,
            userId: store.id
        });
        like.value = true;
        likes.value = response.data.likes;
    }
    catch(AxiosError){
        console.log("error catched: AxiosError");
        Notify.create({
            message: 'Error while liking post',
            color: 'negative',
            position: 'top'
        });
    }
}

async function unlikePost(){
    try{
        const response = await PostService.unlikePost({
            postId: props.post.id,
            userId: store.id
        });
        like.value = false;
        likes.value = response.data.likes;
    }
    catch(AxiosError){
        console.log("error catched: AxiosError");
        Notify.create({
            message: 'Error while unliking post',
            color: 'negative',
            position: 'top'
        });
    }
}

onMounted(() => {
    like.value = props.post.isLiked;
    likes.value = props.post.likes;
})

</script>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.2s;
}
.bounce-leave-active {
  animation: bounce-in 0.2s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
</style>