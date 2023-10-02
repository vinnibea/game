<script setup>

import { useAuthStore } from '../stores/counter';
import { ref } from 'vue';
import Button from '../UI/Button.vue'

const email = ref('');
const password = ref('');
const store = useAuthStore();


const validator = () => {
  if (email.value && password.value) {
    store.registerFn(email.value, password.value);
    email.value = '';
    password.value = '';
  } else {
    return;
  }
}  
</script>

<template>
  <div class="login-page">
    <div class="login-page-top">
    
    </div>
    <form class="form form-login" @submit.prevent="validator">
        <h1 class="form-title">
          Create new account
        </h1>
       
       
        <input class="form-input" v-model="email" type="email" placeholder="Enter your email" />
        <input class="form-input" v-model="password" type="password" placeholder="Enter your password" />
        <input class="form-input" v-model="password" type="password" placeholder="Re-enter your password" />
        
        
        <div class="form-bottom">
            <button class="form-button" type="submit">Submit</button>
        </div>
       
       
        <span class="form-suggestion">Have an existing account? Login
        
        <RouterLink to="/login">here</RouterLink>
            </span>
    </form>
  </div>
</template>

<style>


</style>