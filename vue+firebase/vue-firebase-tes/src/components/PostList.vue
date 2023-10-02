<script setup>
import { usePostsStore } from '../stores/postStore';
import { useRoute, useRouter } from 'vue-router';
import { watch, ref as vueRef, onMounted } from 'vue';
import { getDatabase, ref, set, onValue, get, push, query } from "firebase/database";
import { formatDistance, subDays } from 'date-fns'
import { auth, db } from '../firebase/firebase';
import { useAuthStore } from '../stores/counter';
import { useImageStore } from '../stores/imageStore';
import { useUserStore } from '../stores/userPageStore';

const postStore = usePostsStore();
const store = useAuthStore();
const user = useUserStore().userInfo
const route = useRoute();
const postToDelete = vueRef();
const showModal = vueRef(false)

const emit = defineEmits(['onPicsSelected', 'setPics']);

const onPostDeleted = (id) => {
    postToDelete.value = id;
    setTimeout(async () => {
        await set(ref(db, 'users/' + store.authUser.uid + '/messages' + `/message-${id}`), {});
    }, 300)
}

const setSelectedPics = (attachments, i) => {
    emit('onPicsSelected')
    emit('setPics', attachments, i)
}

watch(() => route.params.id, async () => {

    const currentPage = route.fullPath === '/home' ? store.authUser.uid : route.params.id;

    console.log(currentPage)
    const currentMessages = await ref(db, 'users/' + currentPage + '/messages');

    onValue(currentMessages, async (snapshot) => {
        if (!snapshot.exists()) {
            postStore.posts = [];
            return;
        };

        const data = await snapshot.val();
        if (data) {
            showModal.value = false;
            await postStore.setPosts(currentPage);
            return;
        }
    })
}, { immediate: true })







</script>

<template>
    <section class="post-list">
        <article class="post" v-for="post in postStore.sortedPosts" :key="post.id">
            <div class="post-top">
                <div class="post-details">

                    <img class="post-userImg" :src="useImageStore().mainImage" width="40" height="40" />

                    <div class="post-info">

                        <h4 class="post-user-name" @click="router.push(post.author.uid)">
                            {{ post.author.displayName }}
                        </h4>
                        <h5 class="post-time">
                            {{ formatDistance(post.id, new Date()) + ' ago' }}
                        </h5>
                    </div>

                </div>
                <div class="post-control">
                    <span class="post-delete pi pi-times-circle" @click="onPostDeleted(post.id)">
                    </span>
                </div>
            </div>
            <div v-if="!post?.content?.media && post?.content?.text" class="post-content">
                {{ post?.content?.text }}

                <div v-if="post?.attachments?.length === 1">
                    <div class="post-gallery">
                        <img class="post-gallery-image post-gallery-image-rounded" :src="post?.attachments[0]" width="150"
                            height="250" @click="setSelectedPics(post.attachments, 0)">
                    </div>
                </div>
                <div v-else-if="post?.attachments?.length === 2">
                    <div class="post-gallery-bottom">
                        <img v-for="(smallImage, i) in post.attachments" :key="smallImage"
                            class="post-gallery-image post-gallery-image--medium" :src="smallImage" width="150" height="200"
                            @click="setSelectedPics(post.attachments, i)">
                    </div>
                </div>

                <div v-else-if="post?.attachments?.length === 3">
                    <div class="post-gallery">
                        <img class="post-gallery-image" :src="post.attachments[0]" width="150" height="150"
                            @click="setSelectedPics(post.attachments, 0)">
                    </div>

                    <div class="post-gallery-bottom">
                        <img v-for="(smallImage, i) in post.attachments.slice(1)" :key="smallImage"
                            @click="setSelectedPics(post.attachments, i + 1)"
                            class="post-gallery-image post-gallery-image--small" :src="smallImage" width="200" height="200">
                    </div>
                </div>
                <div v-else-if="post?.attachments?.length > 3" class="post-gallery-wrapper">
                    <div class="post-gallery">
                        <img class="post-gallery-image" :src="post?.attachments[0]" width="150" height="150"
                            @click="setSelectedPics(post.attachments, 0)">
                    </div>
                    <span class="post-gallery-bottom-more">
                        <sup class="post-gallery-bottom-more post-gallery-bottom-more-plus"> + </sup>
                        {{ post?.attachments?.length - 3 }}
                    </span>
                    <div class="post-gallery-bottom post-gallery-bottom-large">

                        <img v-for="(smallImage, i) in post.attachments.slice(1, 3)" :key="smallImage"
                            @click="setSelectedPics(post.attachments, i + 1)"
                            class="post-gallery-image post-gallery-image--small post-gallery-image--more" :src="smallImage"
                            width="200" height="200">

                    </div>
                </div>


            </div>

            <div v-else class="post-content">
                {{ post.content.text }}
                <div class="post-video" v-html="post.content.media"></div>
            </div>



            <div class="post-bottom">
                <div class="post-bottom-buttons">
                    <span class="post-buttons pi pi-heart" @click="onPostUpdated(post)"></span>
                    <span class="post-buttons pi pi-comment"></span>
                    <span class="post-buttons pi pi-link"></span>
                </div>
            </div>
        </article>
    </section>
</template>

<style> .post-gallery-wrapper {
     position: relative;
 }

 .post-gallery {
     position: relative;
     margin: 0 auto;
 }

 .post-gallery-bottom {
     position: relative;
     display: flex;
     flex-wrap: wrap;
     justify-content: space-between;
 }


 .post-gallery-bottom-more {
     font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
     position: absolute;
     color: rgb(236, 236, 236);
     font-size: 48px;
     bottom: 0;
     right: 8px;
     z-index: 212;
 }

 .post-gallery-bottom-more-plus {
     font-size: 16px;
     font-weight: bold;
     bottom: 65%;
     right: 90%;
 }

 .post-gallery-image {
     display: block;
     grid-column: 1 / -1;
     width: 100%;
     background-position: 50% 50%;
     background-repeat: no-repeat;
     object-fit: cover;
     border-radius: 8px 8px 0 0;
     cursor: pointer;
     transition: all 0.6s ease;
     border: 1px solid transparent;

 }

 .post-gallery-image-rounded {
     grid-column: 1 / -1;
     width: 100%;
     background-position: 50% 50%;
     background-repeat: no-repeat;
     object-fit: cover;
     border-radius: 8px;

 }

 .post-gallery-bottom .post-gallery-image {
     flex-basis: 45%;
 }

 .post-gallery-bottom .post-gallery-image:first-child {
     width: 25%;
     border-radius: 0 0 0 8px;
 }

 .post-gallery-bottom .post-gallery-image:last-child {
     width: 25%;
     border-radius: 0 0 8px 0;
 }

 .post-gallery-bottom .post-gallery-image:nth-child(2) {
     flex-grow: 1;
 }

 .post-gallery-image--medium {
     flex-grow: 1;
 }

 .post-gallery-bottom .post-gallery-image--medium:first-child {
     border-radius: 8px 0 0 8px;
 }

 .post-gallery-bottom .post-gallery-image--medium:last-child {
     border-radius: 0 8px 8px 0;
 }

 .post-gallery-bottom .post-gallery-image--more:last-child {
     filter: invert(0.6);
 }

 .post-gallery-image:hover {
     object-position: 22% 30%;

     cursor: pointer;
 }

 .post-video {
     display: block;
     margin: 0 auto;
     padding: 10px;
     border-radius: 8px;
     background-color: rgba(0, 0, 0, 0);
 }

 iframe {
     border-radius: 8px;
     width: 600px;
     height: 300px;
 }

 .post-bottom-buttons {
     display: flex;
     justify-content: center;
     align-items: center;
     color: white;
     gap: 100px;
     padding: 4px 0;
 }

 .post-buttons {
     padding: 10px 20px;
     cursor: pointer;
     border-radius: 6px;
     transition: all 0.3s ease;
     color: rgba(74, 85, 108, 0.972);

 }

 @media (max-width: 468px) {
     .post-bottom-buttons {
         gap: 60px;
     }

     iframe {
         border-radius: 8px;
         width: 300px;
         height: 200px;
     }

 }

 .post-control {
     display: flex;
     gap: 10px;
     align-items: center;
     border-radius: 50%;
 }

 .pi-times-circle {
     color: rgb(104, 104, 104);
     display: flex;
     align-items: center;
     justify-content: center;
     cursor: pointer;
     padding: 2px;
     border-radius: 50%;
 }

 .post-buttons:hover {
     color: white;
 }


 .post-list {
     position: relative;
     padding: 40px 10px;
     display: flex;
     flex-direction: column;
     align-items: center;
     gap: 4px;
     background-color: rgba(215, 215, 215, 0.076);
     border-radius: 12px
 }

 .post-list-title {
     color: white;
     padding: 4px 20px;
     display: none;
 }

 .post {
     padding: 10px 10px 0 10px;
     width: 90%;
     transition: all 0.3s ease;
     width: 100%;

     border-bottom: 12px solid  rgba(129, 129, 129, 0.837);;
 }

 
 .post-top {
     display: flex;
     align-items: center;
     justify-content: space-between;
     gap: 10px;
 }

 .post-details {
    display: flex;
    gap: 10px;
    align-items: center;
 }

 .post-info {
    display: flex;
    align-items: center;
    padding: 20px;
 }


 .post-user-name {
     font-size: 18px;
     padding: 0 4px;
 }

 .post-userImg {
     border: 3px solid white;
 }

 .post-details {
     display: flex;
     flex-direction: row;
     padding: 4px 40px 4px 4px;
     border-radius: 50px;
     background-color: rgba(19, 19, 19, 0.837);

 }

 .post-info {
     display: flex;
     flex-direction: column;
     align-items: center;
     padding: 2px;
 }

 .post-time {
     color: rgb(96, 96, 96);
     font-size: 12px;
 }

 .post-content {
     display: flex;
     flex-direction: column;
     gap: 20px;
     padding: 10px 20px;
     margin-left: 35px;
     border-left: 1px solid rgba(19, 19, 19, 0.837);
     border-bottom: 1px solid rgba(40, 40, 40, 0.412);
     border-radius: 0 0 0 12px;
 }

 .post-content::first-letter {
     text-transform: capitalize;
     font-weight: 900;
 }

 .post-userImg {
     border-radius: 50%;
     box-shadow: var(--bottom-shadow);
 }

 .btn--delete {
     color: black;
     padding: 4px 10px;
     font-weight: bold;
     font-size: 16px;
 }

 .post-user-name {
     cursor: pointer;
     color: rgb(166, 166, 166);
     width: 100%;
 }

 @media (max-width: 640px) {
     .post-list {
         padding: 0;
     }

     .post {
         width: 100%;
     }

 }
</style>