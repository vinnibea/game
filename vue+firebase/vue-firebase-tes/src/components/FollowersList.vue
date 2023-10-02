<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useFollowersStore } from '../stores/followersStore';
import { useAuthStore } from '../stores/counter';
const authStore = useAuthStore();
const store = useFollowersStore();
const router = useRouter();
const route = useRoute();
onMounted(async () => {
  
})
</script>

<template>
    <section class="followers-section">
        <article class="follower-card" @click="() => router.push({ path: `/user/${follower.uid}`, replace: false })" v-for="follower in store.followers" :key="follower.uid">
            <div class="follower-details">
                <img class="follower-cover" :src="follower.cover" alt="cover" />
                <img class="follower-img" :src="follower.photoURL" />
                <h4 class="follower-name" >
                    {{ follower?.displayName }}
                </h4>
            </div>
            <button v-if="authStore.authUser.uid !== follower.uid" class="follow-back btn">Follow Back</button>
            <button v-else class="follow-back btn">Back to Home</button>
        </article>
    </section>
</template>

<style>
.follower-cover {
 border-radius: 8px 8px 0 0;
 height: 120px;
 width: 100%;
 background-color: black;
}
.follower-img {
    position: absolute;
    bottom: 0;
    transform: translateY(-50%);
    border: 4px solid rgb(255, 255, 255);
    background-color: rgba(189, 189, 189, 0.429);
    border-radius: 50%;
    max-width: 120px;
    max-height: 120px;
    padding: 4px;
}

.follower-name {
    padding: 80px 0 20px 0;
}

.follower-card {
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    background-color: rgba(88, 88, 88, 0.213);
    flex-basis: 180px;
    cursor: pointer;
    padding-bottom: 0px;
    box-shadow: 1px 2px 5px rgb(68, 68, 68);
}

.follower-details {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.followers-section {
    display: flex;
    gap: 10px;
    padding: 40px 20px;
}

.follower-post {
    display: flex;
    align-items: center;
    padding: 20px;
}

.follow-back {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(55, 55, 55);
    opacity: 1;
    font-size: 12px;
    padding: 8px 40px;
    min-width: 180px;
}
</style>