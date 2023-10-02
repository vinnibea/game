<script setup>
import { defineProps } from 'vue';
import { useFollowersStore } from '../stores/followersStore';
const followStore = useFollowersStore();
defineProps({
    follower: Object,
    required: true
})
</script>

<template>
    <div class="followers">
        <div class="followers-info">
            <h3 class="followers-title"> {{ followStore.followers?.length || 0 }}
                <span class="followers-title-span"> Followers </span>
                <div>
                    <img v-for="follower in followStore.followers" :key="follower.uid"
                        class="post-userImg post-userImg--follower" :src="follower.photoURL" width="20" height="20" />
                </div>
            </h3>
            <h3 class="followers-title"> {{ 0 }}
                <span class="followers-title-span"> Following
                </span>
            </h3>
        </div>
    </div>
</template>

<style>
.followers {
    display: flex;
    flex-direction: column;
    padding: 20px 0 0 4px;
}

.followers-info {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.followers-title {
    display: flex;
    flex-direction: column;
    font-size: 24px;
}

.post-userImg--follower {
    cursor: pointer;
    border: 1px solid rgba(54, 54, 54, 0.272);
}

.post-userImg--follower:not(:first-child) {
    transform: translateX(-75%);
}

.followers-title-span {
    text-transform: uppercase;
    font-size: 10px;
    font-weight: 300;
    color: gray;
    transition: all 0.3s ease;
    cursor: pointer;
}

.followers-title-span:hover {
    text-decoration: underline;

}
</style>