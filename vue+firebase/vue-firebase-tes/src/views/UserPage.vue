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
import { useUserStore } from '../stores/userPageStore';
import { useFollowersStore } from '../stores/followersStore';
import { usePostsStore } from '../stores/postStore';
import { useImageStore } from '../stores/imageStore';


//hooks and refs
import { onMounted, onBeforeUnmount, ref as vueRef, watch } from 'vue';
import { db, storage } from '../firebase/firebase';
// import { doc, setDoc, Timestamp, collection, addDoc, updateDoc, getDocs } from "firebase/firestore";
import { ref, set, onValue, get, push } from "firebase/database";


import { useRouter, useRoute } from 'vue-router';
//constants 

const modalComponents = {
  image: ProfileImage,
  creation: Creation,
  edit: EditCompVue,
  gallery: ModalGallery,
}

const mainComponents = {
  posts: PostList,
  followers: FollowersList,
}

//stores
const store = useAuthStore();
const userStore = useUserStore()
const followStore = useFollowersStore();
const postStore = usePostsStore()

//routers && routes
const router = useRouter();
const route = useRoute();
//refs

const loading = vueRef(true);
const showModal = vueRef(false);
const activeModalContent = vueRef(modalComponents.image)
const activeMainContent = vueRef('posts')


//functions
const selectVisibleContent = (str) => {
  activeMainContent.value = str;
}
const onModalClose = () => {
  showModal.value = false;
}


const onUserFollows = async () => {
  const currentPhotoRef = ref(db, 'users/' + store.authUser.uid + '/images/mainImage');
  console.log(store.authUser.uid, 'uid', route.params.id)
  const currentFollowers = await ref(db, 'users/' + route.params.id + '/followers/' + store.authUser.uid);
  const currentBackgroundRef = ref(db, 'users/' + store.authUser.uid + '/images/backgroundImage');

  const avatar = await get(currentPhotoRef);
  const cover = await get(currentBackgroundRef)

  console.log(avatar.val())
  await set(currentFollowers, {
    ...store.authUser, 
    cover: cover.val().img,
    photoURL: avatar.val().img,
  });

}

const onUserUnFollows = async () => {
  const currentFollowers = ref(db, 'users/' + route.params.id + '/followers/' + store.authUser.uid);
  const follower = await get(currentFollowers)
  await set(currentFollowers, {})
}


const defineActiveModalContent = (value) => {
  activeModalContent.value = modalComponents[value]
  showModal.value = true;
}

//watchers
watch(() => route.params.id, async () => {
  if(route.params.id === store.authUser.uid) {
    router.push('/home')
  }
  activeMainContent.value = 'posts';
  const currentMessages = await ref(db, 'users/' + route.params.id + '/messages');
  const currentUser = await ref(db, 'users/' + route.params.id + '/details');
  userStore.setUser(route.params.id)
  onValue(currentMessages, async (snapshot) => {
    showModal.value = false;

    setTimeout(() => {
      loading.value = false;
    }, 500)
  });

  
  const currentFollowers = await ref(db, 'users/' + route.params.id + '/followers');
  const isFollower = await ref(db, 'users/' + route.params.id + '/followers/' + store.authUser.uid);

  onValue(isFollower, (snapshot) => {
    if (snapshot.exists()) {
      isFollowed.value = true;
    } else {
      isFollowed.value = false;
    }
  })

  onValue(currentFollowers, (snapshot) => {
    if(!snapshot.exists()) {
      followStore.setFollowers(null);
      return;
    }
    const followersFromSnapShot = Object.values(snapshot.val());

   
    followStore.loadFollowers()
  });

    store.setUser();

    followStore.loadFollowers()
}, { immediate: true })

const isFollowed = vueRef(false)

//lifecycle hooks
onMounted(async () => {
  await useAuthStore().setUser();  
  const uid = route.params.id;
  postStore.setPosts(route.params.id)
  followStore.loadFollowers(uid)
  const currentFollowers = await ref(db, 'users/' + uid + '/followers');
  const isFollower = await ref(db, 'users/' + uid + '/followers/' + store.authUser.uid);

  onValue(isFollower, (snapshot) => {
    if (snapshot.exists()) {
      isFollowed.value = true;
      followStore.loadFollowers();
    } else {
      isFollowed.value = false;

      followStore.loadFollowers();
    }
  })

  onValue(currentFollowers, (snapshot) => {
    followStore.loadFollowers()
  });

  store.setUser();
  userStore.setUser(uid);
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
    <user-header></user-header>
    
    <div class="user">
      <UserPageTop @changeModalContent="defineActiveModalContent"></UserPageTop>
      <div class="user-description user-description--guest">
        <div class="user-description-content">
          <h1 class="user-name"> {{ userStore.userInfo?.displayName }}</h1>
          <h4 class="user-nickname"> {{ userStore.userInfo?.nickname }}</h4>

          <p class="user-bio user-bio--guest">

            {{ userStore.userInfo?.bio }}
          </p>
          <div class="action-buttons" v-if="route.params.id">
            <Button class="btn" v-if="!isFollowed" @click="onUserFollows">
              <span class="pi pi-user-plus">
                Follow
              </span>
            </Button>

            <Button class="btn" v-else @click="onUserUnFollows">
              <span class="pi pi-user-minus">
                Unfollow
              </span>
            </Button>

            <RouterLink :to="`/messages/${route.params.id}`">
              <Button class="btn" @click="console.log('clicked')">
                <span class="pi pi-send">Message</span>
              </Button>
            </RouterLink>
          </div>
          <FollowersSection />

          <p class="user-location user-location--guest">
            <span class="pi pi-compass" />
            {{ userStore.userInfo?.location }}
          </p>

        </div>
       
      </div>
      




      <div class="user-posts">

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
        />
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
           @modalClose="onModalClose"
           :pics="pictures"
           :selected="selected"
        >
        </component>
      </KeepAlive>
    </template>
  </Modal>
</template>
<style>
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
}

.user {
  position: relative;
  width: 100%;
  margin: 50px 0 0 0;
  padding: 0 120px;
  border-right: 1px solid rgba(60, 54, 54, 0.068);
  background-color: rgba(208, 208, 208, 0.635);
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
  background-color: rgba(222, 222, 222, 0.603);
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