import { defineStore } from 'pinia';
import { computed, ref as vueRef } from 'vue';
import { useAuthStore } from './counter';
import { getDatabase, ref, set, onValue, get } from "firebase/database";
import { db } from '../firebase/firebase';

export const usePostsStore = defineStore('usePostsStore', () => {
    const posts = vueRef([]);

    const setPosts = (uid) => {
        const currentMessages = ref(db, 'users/' + uid + '/messages');
        get(currentMessages).then(snapshot => {
            if(snapshot.exists()) {
                posts.value = snapshot.val();
                return;
            } else {
                return [];
            }   
        })
    }

    const postsLength = computed(() => Object.values(posts.value).filter(post => post)?.length) || 0;
    const sortedPosts = computed(() => posts.value && Object.values(posts?.value).sort((a, b) => b.id - a.id));
    
    return {
        setPosts,
        posts,
        postsLength,
        sortedPosts,
    }
})