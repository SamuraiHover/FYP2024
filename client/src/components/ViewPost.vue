// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/components/ViewPost.vue
// Description       : The ViewPost component is used to display the post and club feeds. It is used to display the post and club feeds.
<template>
    <q-tabs v-if="club" v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary"
        align="justify" narrow-indicator @update:model-value="fetchData">
        <q-tab name="all" label="Feeds" />
        <q-tab name="club" label="Club Feeds" />
    </q-tabs>
    <div class="row no-wrap justify-center">
        <div class="q-pa-md column items-start justify-start" style="width:auto;">
            <q-select class="q-pb-md" dense flat outlined v-model="sort" :options="sortType"
                @update:modelValue="sortPost()">
                <template v-slot:prepend>
                    <q-icon name="sort" />
                </template>
            </q-select>
            <div class="column items-center justify-center q-gutter-y-md">
                <PostCard v-for="post in posts" :key="post.id" :post="post" />

                <Transition name="slide-fade-transition">
                    <q-btn v-if="true" v round color="primary" @click="GoToTop" class="fixed-bottom-right">
                        <q-icon name="arrow_upward" />
                    </q-btn>
                </Transition>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';
import { Loading } from 'quasar';
import { useStore } from '../store/store';
import PostCard from './PostCard.vue';
import PostService from '../services/PostService';
import ClubService from '../services/ClubService';

const posts = ref([]);
const store = useStore()
const tab = ref('all');
const club = ref(null);
const sort = ref('Latest');
const sortType = ['Latest', 'Oldest','Most Popular'];

function GoToTop() {
       window.scrollTo({top:0, behavior: 'smooth'});
}

async function fetchData() {
	Loading.show();
    sort.value = 'Latest'
    try {
        const response = await ClubService.getClub({
            id: store.id,
            role: store.role
        });
        club.value = response.data;
    } catch (AxiosError) {
        console.log("error catched: AxiosError");
        club.value = null;
    }
	try {
        if(tab.value === 'all'){
            const response = await PostService.getAllPosts({
                userId: store.id
            });
            posts.value = response.data;
            posts.value.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
        }
        else{
            const response = await PostService.getAllPostsClubOnly({
                userId: store.id,
                clubId: club.value.id
            });
            posts.value = response.data;
            posts.value.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
        }
        console.log(posts.value);
	} catch (AxiosError) {
		console.log("error catched: AxiosError");
		posts.value = [];
	}
	Loading.hide();
}

function sortPost(){
    console.log(sort.value)
    if(sort.value =='Latest'){
        posts.value.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
    }
    else if(sort.value =='Oldest'){
        posts.value.sort((a, b) => new Date(a.postDate) - new Date(b.postDate));
    }
    else if(sort.value =='Most Popular'){
        posts.value.sort((a, b) => b.likes - a.likes);
    }
}

onMounted(() => {
    fetchData();
});
</script>

<style scoped>
.fixed-bottom-right {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>