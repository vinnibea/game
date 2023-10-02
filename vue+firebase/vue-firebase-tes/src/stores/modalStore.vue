<!-- <script setup>
import { defineStore } from "pinia";
import  { ProfileImage } from '../components/ProfileImage.vue'
import { ref } from "vue";

export const useModalStore = defineStore('modal', () => {
    // const modalComponents = {
    //     image: ProfileImage,
    //     followers: FollowersSection,
    //   }
  const components = {
    image: ProfileImage
  }

  const activeModalComponent = ref(ProfileImage)
    
  return {
       activeModalComponent,
    }
})
</script> -->