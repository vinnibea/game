import { defineStore } from 'pinia';
import { ref as vueRef } from 'vue';
import { getDatabase, ref, set, onValue, get } from "firebase/database";
import { db, firestoreDB } from '../firebase/firebase';
import { useRoute } from 'vue-router';
import { usePostsStore } from './postStore';
import { useImageStore } from './imageStore';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const useUserStore = defineStore('userStore', () => {
  const userInfo = vueRef(null);
  const route = useRoute();
  const postStore = usePostsStore();
  const imageStore = useImageStore();
  const chats = vueRef(new Map());


  const setUser = (uid) => {
    const pageOwner = ref(db, 'users/' + uid + '/details');
    const pagePosts = ref(db, 'users/' + uid + '/messages');

    get(pageOwner).then((snapshot) => {
      userInfo.value = snapshot.val();
      imageStore.setPictures(uid);
    })

    get(pagePosts).then((snapshot => {
      if (snapshot.exists()) {
        postStore.setPosts(uid);
      }
    }))
  }


  const setChats = async (uid, lastMessage) => {
    const q = query(collection(firestoreDB, "users"), where("uid", "==", uid));
   console.log(lastMessage, 'lastmessage')
    const querySnapshot = await getDocs(q);
   
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshot
      const dataToWriteToChatLabel = {
        ...doc.data(),
        lastMessage,
      }
      console.log(chats.value)
      chats.value.set(doc.data().uid, dataToWriteToChatLabel);
    });
  }

  return {
    setUser,
    userInfo,
    chats,
    setChats
  }
})