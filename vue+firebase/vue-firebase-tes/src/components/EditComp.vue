<script setup>
import UserPageTop from './UserPageTop.vue';
import { useAuthStore } from '../stores/counter';
import { ref as vueRef, onMounted, inject, reactive } from 'vue';
import {ref, get, set} from 'firebase/database';

import {db} from '../firebase/firebase';

const store = useAuthStore();
const emit = defineEmits(['fieldsUpdated', 'modalClose', 'saveUserInfo']);
const name = vueRef(store.authUser.displayName)
const bio = vueRef(store.authUser.bio || '') ;
const location = vueRef(store.authUser.location || '') ;


const fieldInputCap = () => {
    emit('fieldsUpdated', {
    displayName: name.value.trim(),
    bio: bio.value.trim(),
    location: location.value.trim(),
   
})    
}

const onSave = () => {
    emit('saveUserInfo');
    emit('modalClose')
}

</script>

<template>
    <div class="edit-wrapper">
         
        <UserPageTop>

        </UserPageTop>

        <form class="profile-edit">
            <input 
            type="text" 
            placeholder="Name" 
            class="profile-edit-input" 
            v-model="name" 
            @input="fieldInputCap"
            disabled  
            />
            <textarea 
                placeholder="Bio" 
                v-model="bio"
                class="profile-edit-input" 
                @input="fieldInputCap" 
                />
            <input
              type="text" 
              placeholder="Location" 
              v-model="location" 
              class="profile-edit-input" 
              @input="fieldInputCap"
             >
            <button class="btn btn-save" @click.prevent="onSave">Save</button>
        </form>
    </div>
</template>

<style>
.edit-wrapper {
    display: flex;
    flex-direction: column;
    padding: 20px;
    width: 60%;
    overflow-y: hidden;
}

.profile-edit {
    display: flex;
    flex-direction: column;
    padding-top: 100px;
    gap: 20px;
}

.profile-edit-input {
    padding: 20px 20px;
    border-radius: 4px;
    border: 2px solid rgb(194, 194, 194);
    resize: none;
}

.profile-edit-input:disabled {
    background-color: rgba(165, 165, 165, 0.745);
    border: 2px solid  rgba(120, 119, 119, 0.745);
    color: rgb(75, 75, 75);
    cursor:no-drop
}
.profile-edit-input:focus {
    border-color: rgba(33, 29, 114, 0.737);
    outline: none;
}

.btn-save {
    background-color: rgb(33, 33, 134);
    align-self: flex-end;
    width: 30%;
}
@media (max-width: 1124px) {
    .edit-wrapper {
        overflow: hidden;
    }

    .profile-edit-input {
        padding: 10px;
    }
    
}

@media(max-width: 640px) {
    .edit-wrapper {
        width: 100%;
    }
    
}
</style>