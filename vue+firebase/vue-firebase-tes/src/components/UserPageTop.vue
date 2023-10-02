<script setup>
import { getStorage, ref as storageRef, getBytes, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { onMounted, onBeforeMount, ref as vueRef, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/counter';
import { db, storage } from '../firebase/firebase';

import ProfileImage from './ProfileImage.vue';
import { getDatabase, ref, set, onValue, get, push } from "firebase/database";
import { useImageStore } from "../stores/imageStore";

const imageStore = useImageStore();
const loaderProgress = vueRef(100);
const isCoverLoading = vueRef(false);
const store = useAuthStore();

const route = useRoute();


const emit = defineEmits(['changeModalContent']);

const onFileUpload = (event, path) => {

    const selectedFile = event.target.files[0];
    if (selectedFile) {
        const imageRef = storageRef(storage, 'images/' + store.authUser.uid + `/${path}`);

        const uploadTask = uploadBytesResumable(imageRef, selectedFile);
        let loadingInterval;
        console.log('file selected')

        if (path === 'backgroundImage') {
            isCoverLoading.value = true;
            loadingInterval = setInterval(() => {
                const randomProgress = Math.floor(Math.random() * (45 - 15) + 15);
                if (loaderProgress.value - randomProgress > 0) {
                    loaderProgress.value = loaderProgress.value - randomProgress;

                } if (loaderProgress.value - randomProgress <= 0) {
                    loaderProgress.value = 0;
                    clearInterval(loadingInterval);
                    setTimeout(() => {
                        loaderProgress.value = 100;
                        isCoverLoading.value = false;
                    }, 100)
                }
            }, 1000);
        }

        uploadTask.on('state_changed', (snapshot) => {
            getDownloadURL(imageRef).then(downloadURL => {
                const uid = store.authUser.uid;
                const userImagesRef = ref(db, 'users/' + uid + `/images/${path}`);
                set(userImagesRef, { img: downloadURL })

                imageStore.setPictures(uid)
            })
        });
    }

}
</script>

<template>
    <div class="user-top">

        <div class="user-image-wrapper" v-if="!isCoverLoading"
            :style="{ backgroundImage: `url(${imageStore.backgroundImage})` }">

            <label v-if="route.fullPath === '/home'" class="background-label">
                <input class="file-upload" type="file" @change="onFileUpload($event, `backgroundImage`)" />
                <span class="pi pi-upload"></span>
            </label>


            <div class="user-logo-wrapper">
                <ProfileImage @click="emit('changeModalContent', 'image')" :src="' ' + imageStore?.mainImage"
                    class="user-image--main" :height="150" :width="150">
                </ProfileImage>
                <label v-if="route.fullPath === '/home'" class="main-photo-upload">
                    <input class="file-upload" type="file" @change.stop="onFileUpload($event)"
                        @change="onFileUpload($event, `mainImage`)" />
                    <span class="pi pi-camera pi-camera-main"></span>
                </label>
            </div>
        </div>


        <div class="user-image-wrapper" v-if="isCoverLoading" :style="{ backgroundColor: 'grey' }">
            <div class="cover-image-loader"> </div>
            <div class="user-logo-wrapper">
                <ProfileImage @click="emit('changeModalContent', 'image')" :src="imageStore.mainImage"
                    class="user-image--main" :height="150" :width="150">
                </ProfileImage>
            </div>
        </div>


    </div>
</template>

<style>
.pi-camera-main {
    background-color: black;
}
.user-logo-wrapper {
    bottom: -40%;
    left: 10px;
    position: absolute;
}


.user-top {
    display: flex;
    flex-direction: row;
    background-color: rgb(86, 86, 86);
    position: relative;
    width: 100%;
    height: max-content;
}

.cover-image-loader {
    position: absolute;
    bottom:  0;
    left: 0;
    right: v-bind(loaderProgress + '%');
    background-color: rgba(41, 41, 41, 0.879);
    z-index: 100;
}

.user-image-wrapper {
    position: relative;
    height: 200px;
    width: 100%;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    object-fit: fit;
    background-size: cover;
}

.background-label {
    position: absolute;
    top: 10px;
    right: 10px;
    color: white;
}

.main-photo-upload {
    position: absolute;
    bottom: 10px;
    left: 24px;
}

.pi-camera {
    width: 28px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.file-upload {
    opacity: 0;
}

.user-image--main {
    position: absolute;
    bottom: -40%;
    left: 10px;
    cursor: pointer;
    transition: all 0.5s ease;
}

.user-image--main:hover {
    filter: grayscale(0.5)
}
</style>