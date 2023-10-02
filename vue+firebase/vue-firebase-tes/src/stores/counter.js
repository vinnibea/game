import { ref as vueRef } from 'vue'
import { defineStore } from 'pinia'
import { useRoute, useRouter } from 'vue-router';



import {addDoc, setDoc, collection} from 'firebase/firestore'
import { get, set, ref } from 'firebase/database';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';


import { usePostsStore } from './postStore';
import { useImageStore } from './imageStore';

import { auth, db, firestoreDB } from '../firebase/firebase';


export const useAuthStore = defineStore('authStore', () => {
  const user = vueRef({});
  const authUser = vueRef({});
  const errors = vueRef(null);
  const router = useRouter();
  const route = useRoute();
  const isAuth = vueRef(false);
  let localUser = vueRef(null);
  
  const postStore = usePostsStore();

  const registerFn = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      user.value = auth.currentUser;
      isAuth.value = true;
      // set(ref(db, 'users/' + user.value.uid + '/details', { ...user.value }));

      router.push(`/user/${user.value.uid}`)
    } catch (error) {

      errors.value = error;
    }
  }

  const loginFn = async (email, password) => {
    // try {
    //   await signInWithEmailAndPassword(auth, email, password);
    //   user.value = auth.currentUser;
    //   isAuth.value = true;
    //   localStorage.setItem('user', JSON.stringify(user.value));
    //   console.log(user.value, 'user')
    //   set(ref(db, 'users/' + user.value.uid + '/details'), { ...user.value });
    //   router.push(`/user/${user.value.uid}`)


    // } catch (error) {
    //   errors.value = error;
    //   console.log(errors.value)
    // }
  }

  const logoutFn = async () => {
    try {
      await auth.signOut();
      localStorage.clear();
      isAuth.value = false;
      setUser()
      router.push('/login');
    } catch (error) {
      errors.value = error;
    }
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then(result => {
        const newUserRef = ref(db, `users/${result.user.uid}/details`);
        const newUserImagesRef = ref(db, `users/${result.user.uid}/images/mainImage/img`)

        
        get(newUserRef)
          .then(async (snapshot) => {
            if (snapshot.exists()) {
              const userDetails = snapshot.val();
              setUser(userDetails);
              await localStorage.setItem('authUser', JSON.stringify(userDetails));
              // await set(newUserImagesRef, result.user.photoURL);
              isAuth.value = true;

              return;
            } else {
              const newUser = {
                displayName: result.user.displayName,
                uid: result.user.uid,
                email: result.user.email,
                photoURL: result.user.photoURL,
                completed: false,
                images: {
                  mainImage: result.user.photoURL,
                }
              };



              await localStorage.setItem('authUser', JSON.stringify(newUser));
              const docRef = await addDoc(collection(firestoreDB, "users"), newUser);
              

             await setUser(newUser)

              await set(newUserRef, newUser);

              await set(newUserImagesRef, result.user.photoURL);


             
              isAuth.value = true;
            }
          })
      })
      .catch((e) => {
        errors.value = e;
      })
  }

  const setUser = async (details) => {
    if (!details) {
      try {
        const localUser = await JSON.parse(localStorage.getItem('authUser'));
        if (!localUser?.uid) {
          authUser.value = null;
          router.replace({ name: 'login' });
          return;
        }

        else if (localUser.uid) {
          authUser.value = localUser;
          const postRef = ref(db, `users/${localUser.uid}/messages`);
          useImageStore().setPictures(localUser.uid);

          get(postRef).then(snapshot => {
            if (snapshot.exists() && route.fullPath === '/home') {
              postStore.setPosts(localUser.uid);
            }
          });

          if (route.fullPath === '/login' || route.fullPath === '/register') {
            router.replace({ name: 'Home' });
          }
          return;
        }
      } catch (error) {
        errors.value = error;
      }

    } else {
      authUser.value = details;
      useImageStore().setPictures(details.uid);
      if (route.fullPath === '/login' || route.fullPath === '/register') {
        router.replace({ name: 'Home' });
      }
    }
  }

  return { user, errors, registerFn, loginFn, isAuth, logoutFn, loginWithGoogle, setUser, authUser }
})
