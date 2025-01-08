// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/components/ClubPostList.vue
// Description       : The ClubPostList component is used to display the list of posts in the club.
<template>
	<div class="q-pa-md" v-if="club">
		<q-table bordered title="Posts" :rows="tableData" :columns="qTableHeader" row-key="id" selection="single"
			v-model:selected="selected" @update:selected="togglerFunction()"
			no-data-label="I didn't find anything for you" :filter="filter" :filter-method="filterData">
			<template v-slot:top>
				<div class="col-2 q-table__title">Club Postings</div>
				<q-space />
				<q-btn class="q-ml-md" color="green" label="Add" @click="openAddDialog()" />
				<q-btn class="q-ml-md" color="red" label="Delete" :disabled="toggler" @click="PostDelete()" />
				<q-btn class="q-ml-md" label="Edit" :disabled="toggler" @click="openEditDialog()" />
				<q-input v-model="filter" dense outlined input-class="text-left" class="q-ml-md" placeholder="Search">
					<template v-slot:append>
						<q-icon v-if="filter === ''" name="search" />
						<q-icon v-else name="clear" class="cursor-pointer" @click="filter = ''" />
					</template>
				</q-input>
			</template>
			<template v-slot:body-cell-postDate="props">
				<q-td :props="props" >
					<span> {{ new Date(props.row.postDate).toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }) }}</span>
				</q-td>
			</template>
			<template v-slot:body-cell-imageUrl="props">
				<q-td :props="props" v-if="props.row.imageUrl">
					<img :src="baseURL + props.row.imageUrl" style="width:100px; height:100px">
				</q-td>
				<q-td :props="props" v-else>
					<span>No Image Available</span>
				</q-td>
			</template>
			<template v-slot:body-cell-postContent="props">
				<q-td :props="props" v-html="props.row.postContent">

				</q-td>
			</template>
		</q-table>
	</div>
	<div class="q-pa-md" v-else>
		<q-card>
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6 text-weight-bold">No Assigned Club</div>
			</q-card-section>
		</q-card>
	</div>

	<q-dialog v-model="addDialog" persistent>
		<q-card style="width: 400px">
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6">Create Post</div>
				<q-space />
				<q-btn icon="close" flat round dense @click="closeAddDialog()" />
			</q-card-section>
			<q-card-section class="q-pa-md">
				<q-input filled v-model="manipulatedData.postTitle" label="Title" class="col q-mb-md" maxlength="30" counter
					:rules="[val => !!val || 'Field is required']" />
				<q-input filled autogrow v-model="manipulatedData.postContent" label="Content" class="col q-mb-md"  maxlength="250" counter
					hint="Press ENTER for next line" :rules="[val => !!val || 'Field is required']"  />
				<q-checkbox v-model="manipulatedData.clubOnly" label="Only Club Members Can See This Post" />
				<q-uploader style="width: 100%; height: 100%;" label="Select Image To Upload (Optional)" ref="uploader"
					accept="image/*" hide-upload-btn no-thumbnails @added="handleAdded" @removed="handleRemoved" flat
					bordered />
				<img :src="croppedImageDataUrl" style="width:300px" />
			</q-card-section>
			<q-card-section class="row justify-end">
				<q-btn class="q-ml-md" label="Close" color="secondary" flat @click="closeAddDialog()" />
				<q-btn class="q-ml-md" label="Save" color="green" @click="PostCreate()"
					:disable="!manipulatedData.postTitle || !manipulatedData.postContent" />
			</q-card-section>
		</q-card>
	</q-dialog>

	<q-dialog v-model="cropDialog" persistent>
		<q-card >
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6">Crop Image</div>
				<q-space />
				<q-btn icon="close" flat round dense @click="closeCropDialog()" />
			</q-card-section>
			<q-card-section class="q-pa-md">
				<div>
					<img ref="image" style="display:block; max-width: 100%;" />
				</div>
			</q-card-section>
			<q-card-section class="row justify-end">
				<q-btn class="q-mr-md" label="Cancel" color="secondary" flat @click="closeCropDialog()" />
				<q-btn class="q-ml-md" label="Save" color="green" @click="SaveCroppedImg()" />
			</q-card-section>
		</q-card>
	</q-dialog>

	<q-dialog v-model="editDialog" presistent>
		<q-card style="width: 400px">
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6">Create Post</div>
				<q-space />
				<q-btn icon="close" flat round dense @click="closeEditDialog()" />
			</q-card-section>
			<q-card-section class="q-pa-md">
				<q-input filled v-model="manipulatedData.postTitle" label="Title" class="col q-mb-md"
					:rules="[val => !!val || 'Field is required']  && [val => val.length <= 60 || 'Please use maximum 60 characters' ]" />
				<q-input filled autogrow v-model="manipulatedData.postContent" label="Content" class="col q-mb-md" 
					:rules="[val => !!val || 'Field is required']  && [ val => val.length <= 250 || 'Please use maximum 250 characters' ]" />
				<q-checkbox v-model="manipulatedData.clubOnly" label="Only Club Members Can See This Post" />
				<img :src="baseURL + manipulatedData.imageUrl" style="width:300px;">
			</q-card-section>
			<q-card-section class="row justify-end">
				<q-btn class="q-ml-md" label="Close" color="secondary" flat @click="closeEditDialog()" />
				<q-btn class="q-ml-md" label="Save" color="green" @click="PostEdit()"
					:disable="!manipulatedData.postTitle || !manipulatedData.postContent" />
			</q-card-section>
		</q-card>
	</q-dialog>

</template>

<script setup>
import Cropper from 'cropperjs';
import PostService from '../services/PostService';
import ClubService from '../services/ClubService';
import { ref } from 'vue';
import { toRaw } from 'vue';
import { onMounted } from 'vue';
import { useStore } from '../store/store';
import { Loading, Notify } from 'quasar';
import { onUnmounted } from 'vue';
import 'cropperjs/dist/cropper.css';
import {baseURL} from '../services/Api.js';


const filter = ref("");
const qTableHeader = [
	{ name: 'postTitle', required: true, label: 'Title', align: 'left', field: 'postTitle', sortable: true },
	{ name: 'postContent', label: 'Content', field: 'postContent', sortable: true, align: 'left' },
	{ name: 'postDate', label: 'Date Created', field: 'postDate', sortable: true , align: 'left'  },
	{ name: 'imageUrl', label: 'Image', field: 'imageUrl', align: 'center'},
	{ name: 'author', label: 'Created By', field: row => row.User.name, align: 'left'},
	{ name: 'clubOnly', label: 'Access', field: row => row.clubOnly? "Club Only":"Public", align: 'left'}
];
var tableData = ref([]);
const selected= ref([]);
const toggler= ref(true);
const addDialog= ref(false);
const cropDialog= ref(false);
const editDialog= ref(false);
let croppedImageDataUrl = ref(null); 
const imgName = ref(null);
const club = ref(null);

const uploader = ref(null);
const image = ref(null);
let cropper = null;

const manipulatedData= ref(null);
const store = useStore();

const handleAdded = files => {
	cropDialog.value = true;
	const reader = new FileReader();
	reader.onload = e => {
		image.value.src = e.target.result;
		cropper = new Cropper(image.value, {
			zoomable: false,
			scalable: false,
			aspectRatio: 1,
			viewMode: 2,
		});
	};
	imgName.value = files[0].name;
	reader.readAsDataURL(files[0]);
};

const handleRemoved = () => {
	croppedImageDataUrl.value = null;
};

function filterData(rows, term) {
	const filteredItems = tableData.value.filter(item => `${item.postTitle} || ${item.postContent} || ${item.postDate}`.toLowerCase().includes(term.toLowerCase()));
	return filteredItems;
}

async function fetchData() {
    try {
        Loading.show();
        const response = await ClubService.getClub({
            id: store.id,
            role: store.role
        });
        
        club.value = response.data;
    } catch (AxiosError) {
        console.log("error catched: AxiosError");
        club.value = null;
    }
    if (club.value) {
        try {
            Loading.show();
            console.log(store.id)
            const response = await PostService.getPostsClubCommittee({
                 userId: store.id,
                 clubId: club.value.id
                }
            );
            tableData.value = response.data;
        } catch (AxiosError) {
            console.log("error catched: AxiosError");
            tableData.value = [];
        }
        console.log(tableData.value);
    }
	Loading.hide();
	
}

async function PostCreate() {
	try {
		Loading.show();
		const formData = new FormData();
		const imgResponse = await fetch(croppedImageDataUrl.value);
		if(imgResponse.status == 200){
			const imgResponse = await fetch(croppedImageDataUrl.value);
			const croppedImageBlob = await imgResponse.blob();
			formData.append('image', croppedImageBlob, imgName.value);
		}
		formData.append('userId', store.id);
		console.log(club.value)
		formData.append('clubId', club.value.id);
		
		for(const key in manipulatedData.value) {
			if(key == 'postContent')
			{
				formData.append(key, manipulatedData.value[key].replace(/\n/g, '<br>'))
			}else{
				formData.append(key, manipulatedData.value[key]);
			}
			
		}
		await PostService.createPostClub(formData);
		Notify.create({
			message: 'Post Created Successfully',
			color: 'positive',
			position: 'top',
			timeout: 2000,
		});
		refresh();
		closeAddDialog();
	}catch (AxiosError) {
		console.log();	
		Notify.create({
			message: 'Post Creation Failed',
			color: 'negative',
			position: 'top'
		});
	}
	Loading.hide();
}

async function PostDelete() {
	try{
		await PostService.deletePostClub(toRaw(selected.value[0]));
		Notify.create({
			message: 'Post Deleted Successfully',
			color: 'positive',
			position: 'top',
			timeout: 2000,
		})
		refresh();
	}catch(AxiosError){
		console.log("error catched: AxiosError");
		Notify.create({
			message: 'Post Deletion Failed',
			color: 'negative',
			position: 'top'
		});
	}
}

async function PostEdit() {
	try{
		Loading.show();
		const post = await PostService.editPostClub({
			id: manipulatedData.value.id,
			postTitle: manipulatedData.value.postTitle, 
			postContent: manipulatedData.value.postContent.replace(/\n/g, '<br>'),
			clubOnly: manipulatedData.value.clubOnly
		});
		Notify.create({
			message: post.data.message,
			color: 'positive',
			position: 'top',
			timeout: 2000,
		});
		refresh();
		closeEditDialog();
	}catch (AxiosError) {
		console.log("error catched: AxiosError");
		Notify.create({
			message: 'Post Edit Failed',
			color: 'negative',
			position: 'top'
		});
	}
	Loading.hide();
}

function openAddDialog() {
	manipulatedData.value = {};
	manipulatedData.value.clubOnly = false;
	addDialog.value = true;
}

function closeAddDialog() {
	manipulatedData.value = null;
	imgName.value = null;
	croppedImageDataUrl.value = null;
	addDialog.value = false;
	uploader.value.reset();
}

function closeCropDialog() {
	cropDialog.value = false;
	uploader.value.reset();
	cropper.destroy();
}

function SaveCroppedImg() {
	const croppedImg = cropper.getCroppedCanvas();
	croppedImageDataUrl.value = croppedImg.toDataURL(); // Convert the cropped image to a data URL and store it
	cropper.destroy();
	cropDialog.value = false;
}

function openEditDialog() {
	const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
	if (new Date(selected.value[0].postDate).getTime() < oneDayAgo) {
		Notify.create({
			message: 'You can only edit posts that are less than 24 hours old',
			color: 'negative',
			position: 'top',
		});
		return;
    }
	manipulatedData.value = JSON.parse(JSON.stringify(selected.value[0]));
	manipulatedData.value.postContent = manipulatedData.value.postContent.replace(/<br>/g, '\n');
	editDialog.value = true;
}

function closeEditDialog() {
	manipulatedData.value = null;
	editDialog.value = false;
}

function togglerFunction() {
	if (selected.value.length > 0) {
		toggler.value = false;
	} else {
		toggler.value = true;
	}
}

function refresh() {
	selected.value = [];
	togglerFunction();
	fetchData();
}

onMounted(() => {
	fetchData();
});

onUnmounted(() => {
  if (cropper) {
    cropper.destroy();
  }
});
</script>
