
<script setup>
import { useAuthStore } from '../stores/counter';
import { useRouter, useRoute } from 'vue-router';
import { usePostsStore } from '../stores/postStore';
import { ref, watch } from 'vue'
import { collection, getDocs } from 'firebase/firestore';
import { firestoreDB } from '../firebase/firebase';


const store = useAuthStore();
const postStore = usePostsStore();

const router = useRouter();
const route = useRoute();
const searchQuery = ref(null)
const searchResults = ref([]);


const onSearch = async () => {
    if (!searchQuery.value.length) return;
    const usersRef = collection(firestoreDB, 'users');
    const users = await getDocs(usersRef);
    users.forEach(snapshot => {
        console.log(snapshot.data().displayName, searchQuery);
        const userName = snapshot.data().displayName.toLowerCase();
        const query = searchQuery.value.toLowerCase();
        if (userName.includes(query)) {

            searchResults.value.push(snapshot.data());
        }
    })
}

function debounce(f, delay = 300) {
    let timer;

    return (...args) => {
        clearTimeout(timer);
        searchResults.value = [];
        timer = setTimeout(() => f.apply(this, ...args), delay);
    }
}

const debounceSearch = debounce(onSearch, 500)

watch(()=> route.params.id, () => {
    searchQuery.value = '';
})
</script>
<template>
    <header class="main-header">
        <div class="header-center">
            <span class="pi pi-arrow-left pi-arrow-left--header" v-on:click="router.go(-1)">

            </span>
            <div class="header-center-content">

                <h3 class="header-center-title">
                    {{ store.authUser?.displayName }}
                </h3>
                <span class="header-center-posts-count"> {{ postStore.postsLength }} posts </span>
            </div>
        </div>


        <div class="header-search">
            <div class="header-search-input-wrapper">
                <input v-model="searchQuery" @input="debounceSearch" class="header-search-input" type="text"
                    placeholder="Search" />
                <span v-if="!searchQuery?.length" class="pi pi-search pi-search-header-search-icon"></span>
            </div>

            <div class="header-search-results" v-if="searchResults.length && searchQuery.length">
                
              <div class="header-search-results-item" v-for="user in searchResults" :key="user.uid" @click="() => {
                    if(route.fullPath === '/home') {
                        router.push(`user/${user.uid}`)
                    } else {
                        router.push(`${user.uid}`)
                    }
                }">
                    <img class="header-search-results-image" :src="user.images.mainImage" width="20" height="20" />
                    <h3 class="search-header">
                        {{ user.displayName }}
                    </h3>
                </div>
                <h5>
                    {{ searchResults?.length > 1 ? `Found: ${searchResults.length} users` : `Found: ${searchResults?.length}
                    user` }}
                </h5>
            </div>
        </div>

    </header>
</template>

<style> 
  .search-header {
     color: rgb(15, 15, 15);
     font-size: 20px;
     font-weight: normal;
     text-transform: lowercase;
     transition: all 0.3s ease;
 }

 .search-header:hover {
     color: rgb(109, 109, 109)
 }

 .header-search-results {
     margin-top: 20px;
     display: flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;
     bottom: -100%;
     left: 20px;
     right: 20px;
     padding: 0 10px;
     background-color: rgba(255, 255, 255, 0.594);
     color: rgb(173, 173, 173);
     z-index: 1999;
     border-radius: 8px;
 }

 .header-search-results-item {
    padding: 4px;
     display: flex;
     flex-direction: row;
     align-self: flex-start;
     gap: 4px;
     color: rgba(149, 149, 149, 0.254);
     border-bottom: 1px solid rgba(208, 208, 208, 0.048);
     align-items: center;
     cursor: pointer;
 }

 .header-search-results-image {
     border: 1px solid rgb(194, 194, 194);
     border-radius: 50%;
     ;
 }

 .main-header {
     position: fixed;
     top: 0;
     left: 0;
     right: 0;
     display: grid;
     grid-template-columns: 1fr 300px;
     grid-template-rows: 44px 1fr;
     padding: 4px 0;
     backdrop-filter: blur(12px);
     z-index: 998;
 }

 .header-center {
     display: flex;
     align-items: center;
     gap: 14px;
     grid-column: 1 / 2;
     grid-row: 1 / 2;
     opacity: 1;
     backdrop-filter: blur(12px);
     padding-left: 20px;
     font-size: 18px;
 }

 .header-search {
     backdrop-filter: blur(12px);
     padding: 0 20px;
 }

 .header-center-content {
     display: flex;
     flex-direction: column;
     padding-left: 20px;
 }

 .pi-arrow-left--header {
     padding: 14px;
     border-radius: 50%;
     font-size: 12px;
     cursor: pointer;
     transition: all 0.3s ease;
 }

 .pi-arrow-left--header:hover {
     background-color: rgba(185, 185, 185, 0.3);
 }

 .header-center-posts-count {
     color: grey;
     font-weight: 100;
     font-size: 14px;
 }

 .header-search-input-wrapper {
     position: relative;
 }

 .header-search-input {
     padding: 12px 45px;
     border-radius: 20px;
     width: 100%;
     outline: none;
     border: 1px solid var(--main-color);
     transition: all 0.3s ease;
 }

 .pi-search-header-search-icon {
     position: absolute;
     top: 12px;
     left: 12px;
 }

 .header-search-input:focus {
     border: 1px solid rgba(40, 40, 40, 0.037);
     background-color: rgba(255, 255, 255, 0.134);
 }

 .pi-search-header-search-icon {

     transition: all 0.3s ease;
 }

 .header-search-input:focus+.pi-search-header-search-icon {
     color: rgba(33, 33, 192, 0);

 }
 
 @media(max-width: 1024px) {
    .header-search {
        padding-left: 40px;
    }

 }
 @media (max-width: 640px) {
     .header-search-results {
         left: 0;
     }

     .main-header {
         display: flex;
         justify-content: space-between;
         align-items: center;
         padding: 5px 4px;
         gap: 40px;
         left: 0;
     }

     .header-search-input {
         width: 40px;
         height: 40px;
         padding: 0px;
         border-radius: 50%;
         background-color: rgba(239, 239, 239, 0.345);
         border: 1px solid rgba(255, 255, 255, 0.037);
         cursor: pointer;
         transition: all 0.5s ease;
     }

     .header-search-input::placeholder {
         opacity: 0;

     }

     .header-search-input:hover {
         width: 120px;
         border-radius: 16px;
         padding-left: 20px;
     }

     .header-search-input:hover::placeholder {
         transition: all 0.5s ease;
         opacity: 1;
     }

     .header-search-input:focus {
         border-radius: 16px;
         width: 90px;
         padding-left: 20px;
     }

     .header-search-input:focus::placeholder {
         opacity: 1;
         font-size: 12px;
     }

     .header-center {
        display: flex;
        align-items: center;
        gap: 2px;
        grid-column: 1 / 2;
        grid-row: 1 / 2;
        opacity: 1;
        backdrop-filter: blur(12px);
        padding-left: 2px;
        font-size: 14px;
    }

 }</style>