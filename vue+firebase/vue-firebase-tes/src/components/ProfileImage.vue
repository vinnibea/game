<script setup>
import { useAuthStore } from '../stores/counter';
import { useImageStore } from '../stores/imageStore';
import { useRoute } from 'vue-router';

const props = defineProps({
    width: {
        type: Number,
        required: true,
        default: 400,
    },

    height: {
        type: Number,
        required: true,
        default: 400,
    },
    src: {
        type: String,
        required: true,
    }
})

const store = useAuthStore();
const imageStore = useImageStore();
const route = useRoute()
</script>

<template>
    <img class="user-image" :src="src || imageStore?.mainImage" :width="props.height"
        :height="props.width" />
</template>

<style> 
   .user-image {
     display: block;
     border-radius: 10%;
     border: 6px solid white;
     box-shadow: var(--bottom-shadow);
 }
</style>