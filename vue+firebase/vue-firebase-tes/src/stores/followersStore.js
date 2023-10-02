import { defineStore } from 'pinia';
import { ref as vueRef } from 'vue';
import { ref, get, set } from 'firebase/database';
import { db } from '../firebase/firebase';
import { useRoute } from 'vue-router';
export const useFollowersStore = defineStore('followers', () => {
  const followers = vueRef();
  const route = useRoute();

  const setFollowers = (payload) => {
    followers.value = payload;
  }

  const loadFollowers = () => {
    const followersRef = ref(db, 'users/' + route.params.id + '/followers');

    get(followersRef).then(snapshot => {
      if (snapshot.exists()) {
        console.log(followers.value)
        followers.value = Object.values(snapshot.val());
      } else {
        followers.value = [];
      }
    })

  }
  return {
    setFollowers,
    followers,
    loadFollowers,
  }
})