<script setup>
import { ref as vueRef, onMounted, inject } from 'vue';
import { ref, get, set } from 'firebase/database';

import { db } from '../firebase/firebase';
import { useAuthStore } from '../stores/counter';

const emit = defineEmits(['closeModal', 'onUpdate']);
const props = defineProps({
    showSave: {
        required: false,
        type: Boolean,
    }
});
const modalPosition = vueRef(0);
const store = useAuthStore();


const close = () => {
    emit('closeModal')
}

const userUpdate = () => {
    emit('onUpdate')
    setTimeout(() => {
        emit('closeModal')
    }, 500)
}

onMounted(() => {
    window.addEventListener('scroll', () => {
        modalPosition.value = window.scrollY;
    })
})
</script>

<template>
    <div class="modal">
        <span class="modal-close pi pi-times-circle" @click="close"></span>
        <div class="dummy">
            <div class="modal-top">
               
            </div>

            <slot name="content">

            </slot>
            <slot class="modal-bottom" name="modal-bottom">

            </slot>
        </div>


    </div>
</template>


<style scoped> 
  .modal-close {
     position: absolute;
     top: 10px;
     left: 10px;
     font-size: 32px;
     cursor: pointer;
     color: rgba(232, 232, 232, 0.256);
     z-index: 999;
 }

 .red {
     width: 20px;
     height: 20px;
     background-color: red;
 }

 .modal {
     position: fixed;
     left: 0;
     right: 0;
     top: 0;
     bottom: 0;
     z-index: 1999;
     display: flex;
     justify-content: center;
     background-color: rgba(5, 5, 5, 0.823);
     backdrop-filter: blur(10px);
 }

 .dummy {
     position: relative;
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;
     width: 100vw;
     padding: 8px;
     background-color: rgba(15, 15, 15);
     opacity: 0.67;
     border-radius: 20px;
 }

 .modal-top {
     display: flex;
     flex-direction: row;
     justify-content: space-between;
     width: 100%;
     align-items: center;
     padding: 0px;
     backdrop-filter: blur(12px);
 }

 .modal .post-bottom {
     padding-top: 40px;
 }

 @media (max-width: 1124px) {
     .modal {
         display: block;
         padding: 0;
         overflow: hidden;
         
     }

     .dummy {
         width: 100dvw;
         height: 100dvh;
         max-height: 100%;
         overflow: hidden;
     }

     .edit-wrapper {
        overflow: hidden;
     }
  
 }

 @media (max-width: 640px) {
    .dummy {
        width: 100dvw;
        height: 100dvh;
        padding: 0;
        overflow: hidden;
    }

    .modal-close {
        font-size: 18px;
        top: 5px;
        left: 2px;
    }
 }


</style>