<script setup>
import { ref } from 'vue';
const props = defineProps({
    pics: {
        type: Array,
        required: true,
    },
    selected: {
        type: Number,
        required: true,
    }
})
const translation = ref(props.selected * (-500));
const selectedPicture = ref(props.selected)

const nextPicture = (i) => {
    console.log(i.clientY)
    const direction = (610 + 110) / 2 > i.clientY ? 1 : -1;
    if (Math.abs(translation.value) >= (props.pics.length - 1) * 500 && direction < 1) {
        translation.value = 0;
        selectedPicture.value = 0;
        return;
    }

    if (!translation.value && direction > 0) {
        translation.value = -(props.pics.length - 1) * 500;
        selectedPicture.value = props.pics.length - 1;
        return
    }

    translation.value += direction * 500;
    selectedPicture.value += -direction;
}

const onPictureSelect = (i) => {
    selectedPicture.value = i;
    translation.value = i * -500
}


</script>
<template>
    <div class="container">
        <div class="gallery-wrapper">

            <div class="gallery-aside">
                <img class="gallery-aside-picture" v-for="(pic, i) in pics"
                    :style="{ borderColor: i === selectedPicture ? 'white' : 'rgba(0, 0, 0, 0.2)' }" :src="pic" :key="pic"
                    alt="aside_pic" @click="onPictureSelect(i)">
            </div>

            <div class="gallery-main">
                <span class="gallery-counter">
                 {{ selectedPicture + 1 + ' / ' + pics.length }}
                </span>
                <img class="gallery-picture" :style="{ transform: `translateY(${translation}px)` }" v-for="pic in pics"
                    :src="pic" :key="pic" alt="pic" @click="nextPicture" />

            </div>

        </div>
        <div class="post-bottom post-bottom-gallery">
            <div class="post-bottom-buttons">
                <span class="post-buttons pi pi-heart" @click="onPostUpdated(post)"></span>
                <span class="post-buttons pi pi-comment"></span>
                <span class="post-buttons pi pi-link"></span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    max-width: 80dvw;
}
.gallery-wrapper {
    display: flex;
    justify-content: center;
    max-width: 1024px;
    z-index: 2001;
    opacity: 1;
    backdrop-filter: none;
    padding: 1px;
    overflow: hidden;
    border-radius: 12px;
    background-color: rgba(255, 255, 255, 0.308);
}

.gallery-aside {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 4px;
}

.post-bottom-gallery {
    padding-bottom: 20px;
    padding-top: 0;
}

.gallery-main {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 500px;
    overflow: hidden;
}
.gallery-counter {
    position: absolute;
    right: 14px;
    top: 14px;
    color: rgb(255, 255, 255);
    z-index: 1;
    background-color: rgba(29, 29, 29, 0.608);
    border-radius: 14px;
    padding: 4px 12px;
    backdrop-filter: none;
}
.gallery-picture {
    min-height: 500px;
    transition: all 0.5s ease;
    object-fit: cover;
    border: 2px solid rgba(0, 0, 0, 0.079);
    border-radius: 12px;

}

.gallery-aside-picture {
    max-width: 50px;
    height: 50px;
    border: 2px solid rgb(255, 255, 255);
    transition: all 0.6s ease;
    object-fit: contain;
    border-radius: 8px;
}

@media(max-width: 640px) {
    .gallery-wrapper {
        flex-direction: column;
        max-width: 100dvw;
        max-height: 100dvh;;
    }

    .gallery-aside {
        flex-direction: row;
        padding-left: 0px;
    }

    .gallery-aside-picture {
        width: 40px;
        height: 40px;
    }

    .gallery-main {
        object-fit: contain;
        padding: 0 0px;
    } 
}
</style>

