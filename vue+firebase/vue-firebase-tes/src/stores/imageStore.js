import { defineStore } from 'pinia';
import { ref as vueRef } from 'vue';
import { getDatabase, ref, set, onValue, get } from "firebase/database";
import { db } from '../firebase/firebase';
import { useRoute } from 'vue-router';
import { usePostsStore } from './postStore';
import { useAuthStore } from './counter';

export const useImageStore = defineStore('imageStore', () => {
    const backgroundImage = vueRef();
    const mainImage = vueRef();
    const route = useRoute();


    const setPictures = (uid) => {
 
        const imagesRef = ref(db, 'users/' + uid + '/images')
        get(imagesRef).then(snapshot => {
            if(snapshot.exists()) {
                backgroundImage.value = snapshot.val().backgroundImage?.img || '';
                mainImage.value = snapshot.val().mainImage?.img || '';
                return;
            } else {
                mainImage.value = useAuthStore()?.authUser?.photoURL;
            }
        })
    }
    return {
       mainImage,
       backgroundImage,
       setPictures
    }
})