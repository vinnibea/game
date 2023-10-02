<script setup>
//imports
import Button from '../UI/Button.vue';
import FollowersSection from '../components/FollowersSection.vue';
import Modal from '../components/Modal.vue';
import ProfileImage from '../components/ProfileImage.vue';
import Creation from '../components/Creation.vue';
import UserPageTop from '../components/UserPageTop.vue';
import EditCompVue from '../components/EditComp.vue';
import PostList from '../components/PostList.vue';
import FollowersList from '../components/FollowersList.vue';
import AsideMenu from '../components/AsideMenu.vue';
import UserHeader from '../components/UserHeader.vue';
import ModalGallery from '../components/ModalGallery.vue';

// component imports ends


//stores
import { useAuthStore } from '../stores/counter';
import { useFollowersStore } from '../stores/followersStore';
import { usePostsStore } from '../stores/postStore';


//hooks and refs
import { onMounted, onBeforeUnmount, ref as vueRef, watch } from 'vue';
import { db, storage, firestoreDB } from '../firebase/firebase';
// import { doc, setDoc, Timestamp, collection, addDoc, updateDoc, getDocs } from "firebase/firestore";
import { ref, set, onValue, get, push } from "firebase/database";
import {addDoc, setDoc, getDoc, doc, getDocs, where, query, collection} from 'firebase/firestore'


import { useRouter, useRoute } from 'vue-router';
//constants 

const modalComponents = {
  image: ProfileImage,
  edit: EditCompVue,
  gallery: ModalGallery,
}

const mainComponents = {
  posts: PostList,
  followers: FollowersList,
}

//stores
const store = useAuthStore();
const followStore = useFollowersStore();
const postStore = usePostsStore();


//routers && routes
const router = useRouter();
const route = useRoute();
//refs

const loading = vueRef(true);
const showModal = vueRef(false);
const activeModalContent = vueRef(modalComponents.image)
const activeMainContent = vueRef('posts')
const updatedInfo = vueRef();


//functions
const selectVisibleContent = (str) => {
  activeMainContent.value = str;
}
const onModalClose = () => {
  showModal.value = false;
}

const defineActiveModalContent = (value) => {
  activeModalContent.value = modalComponents[value]
  showModal.value = true;
}


const onFieldsUpdated = (text) => {
  console.log(text)
  updatedInfo.value = text;
}

const updateUserInfo = async () => {
  const userRef = ref(db, 'users/' + store.authUser.uid + '/details');
  let data = {};

  await get(userRef).then(snapshot => {
    if (snapshot.exists()) {
      data = snapshot.val();
    }
  });


  const nickname = '@' + store.authUser.email.slice(0, 5);
  const newData = { ...data, ...updatedInfo.value, nickname };
  store.authUser = newData;
  localStorage.setItem('authUser', JSON.stringify(newData));
  await set(userRef, newData);
  updatedInfo.value = null;
}

//watchers



const dummy = vueRef()
//lifecycle hooks
onMounted(async () => {
 await useAuthStore().setUser();  
  const currentUser = await useAuthStore()?.authUser;

  const currentFollowers = await ref(db, 'users/' + currentUser?.uid + '/followers');
  const isFollower = await ref(db, 'users/' + currentUser?.uid + '/followers');
  const currentMessages = await ref(db, 'users/' + currentUser?.uid + '/messages');
  const userRef = await collection(firestoreDB, 'users');
 

  onValue(currentMessages, (snapshot) => {
    showModal.value = false;
    usePostsStore().setPosts(currentUser?.uid)
    setTimeout(() => {
      loading.value = false;
    }, 500)
  });

  onValue(isFollower, (snapshot) => {
    if (snapshot.exists()) {
      const followersFromSnapShot = Object.values(snapshot.val());
      followStore.setFollowers(followersFromSnapShot);
      return;
    } else {
      const followersFromSnapShot = Object.values(snapshot.val());
      followStore.setFollowers(followersFromSnapShot);
    }
  })

  onValue(currentFollowers, (snapshot) => {
    if(!snapshot.exists()) {
      followStore.setFollowers([]);
      return;
    };
    const followersFromSnapShot = Object?.values(snapshot.val());
    followStore.setFollowers(followersFromSnapShot);
  });

  
})

 const pictures = vueRef(null);
 const selected = vueRef(0)

 const onAttacmentsSetted = (attachments, i = 0) => {
  console.log(attachments)
   pictures.value = attachments;
   selected.value = i;
 }
</script>

<template>
 <div class="user-page-wrapper"> 

  <div class="user" v-if="store.authUser?.uid">
    <user-header></user-header>
    <UserPageTop @changeModalContent="defineActiveModalContent"></UserPageTop>
    <div class="user-description">
      <div class="user-description-content">
        <h1 class="user-name"> {{ store.authUser.displayName }}</h1>
        <h4 class="user-nickname"> {{ store.authUser.nickname }}</h4>

        <h2 class="user-details">

        </h2>

        <p class="user-bio">
          {{ store.authUser.bio }}
        </p>
        <FollowersSection />
        
        <p class="user-location">
          <span class="pi pi-compass" />
          {{ store.authUser.location }}
        </p>

      </div>

      <button class="btn btn--edit" @click="defineActiveModalContent('edit')">Edit
        <span class="pi pi-user-edit">
        </span>
      </button>
    </div>


    <div class="user-posts">

      <Creation />
      <nav class="main-selector">
        <ul class="main-selector-list">
          <li :class="['main-selector-list-item', {
            'main-selector-list-item--active': activeMainContent === 'posts',
          }]" @click="selectVisibleContent('posts')">
            Posts
          </li>

          <li @click="selectVisibleContent('followers')" :class="['main-selector-list-item', {
            'main-selector-list-item--active': activeMainContent === 'followers',
          }]">
            Followers
          </li>

          <li :class="['main-selector-list-item', {
            'main-selector-list-item--active': activeMainContent === 'likes',
          }]" @click="selectVisibleContent('likes')">
            Likes
          </li>
        </ul>
      </nav>
      <main class="content-section">
        <component 
          :is="mainComponents[activeMainContent]" 
          @onPicsSelected="defineActiveModalContent('gallery')"
          @setPics="onAttacmentsSetted"
        >
      </component>
      </main>
      
    </div>
  </div>
  <AsideMenu></AsideMenu>
 </div>
  <Modal v-if="showModal" @closeModal="onModalClose">

    <template v-slot:content>
      <KeepAlive>
        <component 
           :is="activeModalContent" 
           @fieldsUpdated="onFieldsUpdated"
           @modalClose="onModalClose"
           @saveUserInfo="updateUserInfo"
           :pics="pictures"
           :selected="selected"
        >
        </component>
      </KeepAlive>
    </template>
  </Modal>
</template>

<style>
/** main selector styles **/
.main-selector {
  display: flex;
  width: 100%;
  backdrop-filter: blur(12px);
  z-index: 2;
  transition: all 0.3s ease;

}

.main-selector-list {
  display: flex;
  font-size: 18px;
  list-style-type: none;
  padding: 0 10px; 
}

.main-selector-list-item {
  padding: 20px 40px;
  color: rgba(55, 55, 55, 0.845);
  cursor: pointer;
  transition: all 0.5s ease;
  border-bottom: 2px solid transparent;
}

.main-selector-list-item--active {
  font-weight: 700;
  color: rgb(255, 255, 255);
  pointer-events: none;
  border-bottom: 2px solid white;
}

.main-selector-list-item:hover {
  background-color: var(--base-bcg-color);
}

/** main selector styles ended**/

/** icons styles**/
*,
a {
  text-decoration: none;
  color: black;
}

.pi-upload {
  background-color: black;
  color: white;
  padding: 5px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.367);
}

.pi-compass {
  padding: 4px;
}

.file-upload {
  opacity: 0;
}

.background-label {
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
}


.pi-camera {
  position: absolute;
  left: 110px;
  bottom: -20px;
  font-size: 18px;
  color: white;
  background-color: rgba(14, 14, 161, 0.77);
  padding: 1px 4px;
  border-radius: 4px;
  border: 1px solid white;
  cursor: pointer;
}

/** icons styles**/

.loader {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}


body {
  --secondary-color: rgba(60, 60, 60, 0.548);
  --base-bcg-color: rgb(233, 233, 233);
  --bottom-shadow: 0px 2px 5px rgba(114, 114, 114, 0.2);
  --section-border-top: 2px solid rgba(192, 192, 192, 0.3);
}

.user-page-wrapper {
  position: relative;
  width: 100%;
  padding: 0 0 0 80px;
  position: relative;
  display: grid;

  column-gap: 4px;
  background-color: rgba(103, 103, 103, 0.763);
}

.user {
  position: relative;
  width: 100%;
  margin: 50px 0 0 0;
  padding: 0 120px;
  border-right: 1px solid rgba(60, 54, 54, 0.068);
  background-color: rgba(175, 175, 175, 0.763);
}

.user-name {
  padding: 20px 0 0 0;
  font-weight: 900;
  font-size: 32px;
}

.user-nickname {
  color: grey;
  padding: 5px 0 10px 0;
  font-size: 18px;
  font-weight: 300;
}

.user-location {
  display: flex;
  align-items: center;
  gap: 2px;
  color: grey;
  padding: 25px 0 10px 0;
  font-size: 14px;
  font-weight: 300;
}
.user-bio {
  padding-right: 20px;
}
.user-details {
  color: var(--secondary-color);
}

.user-description {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 75px 20px 20px;
  border-radius: 0;
  background-color: rgba(255, 255, 255, 0.603);
}

.user-description-content {
  display: flex;
  flex-direction: column;
}

.btn--edit {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  text-transform: uppercase;
}

.action-buttons {
  display: flex;
  gap: 10px;
  padding: 20px;
}



.user-details--no-posts {
  border-top: var(--section-border-top);
  text-align: center;
  padding: 40px;
}


@media (max-width: 1024px) {
  .user-page-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-left: 76px; 
  }

  .user {
 
    width: 100%;
    padding: 0;
  }
} 

@media (max-width: 640px) {
  .user-page-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0; 
  }

  .user {
    margin: 50px 0 auto;
    width: 100%;
    padding: 0;
  }
  
  .main-selector-list {
    position: sticky;
    top: 0;
    border-top: 1px solid rgba(167, 164, 164, 0.257);
    width: 100%;
    padding: 0 10px;
  }
  .main-selector-list-item {
    display: flex;
    justify-content: center;
    width: 33%;
  }
}
</style>
