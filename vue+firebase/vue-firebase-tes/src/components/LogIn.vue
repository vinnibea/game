<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/counter';
import { ref, onMounted, onBeforeMount, watch } from 'vue';
import router from '../router';


const store = useAuthStore();
const email = ref('');
const password = ref('');


const validator = () => {
    console.log(email.value)

    if (email.value && password.value) {
        store.loginFn(email.value, password.value);
        email.value = '';
        password.value = '';
        console.log('Done');

    }
    else {
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
            Welcome back!
        </h1>
       
       
        <input class="form-input" v-model="email" type="email" placeholder="Enter your email" />
        <input class="form-input" v-model="password" type="password" placeholder="Enter your password" />
        
        
        <div class="form-bottom">
            <button class="form-button form-button--google-auth" type="submit" @click="store.loginWithGoogle">Login with
                Google</button>
            <button class="form-button" type="submit">Submit</button>
        </div>
       
       
        <span class="form-suggestion">Don`t have an existing account? Register 
        
        <RouterLink to="/signin">here</RouterLink>
            </span>
    </form>
  </div>
</template>

<style>

.login-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: rgba(84, 88, 223, 0.353);
}

.login-page-top {
    flex-grow: 1;

}
.form {
    --color: rgb(235, 235, 235);
    display: flex;
    flex-direction: column;
    min-width: 600px;
    padding: 20px;
    place-self: center;
    gap: 20px;
    background-color: rgba(255, 255, 255, 0.401);
}

.form-bottom {
    display: flex;
    gap: 20px;
    justify-content: flex-end;
}

.form-button {
    align-self: flex-end;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    color: var(--color);
    text-transform: u;
    background-color: rgba(44, 44, 234, 0.635);
}

.form-button--google-auth {
    background-color: rgba(165, 42, 42, 0.782);
}

.form-input {
    padding: 10px 20px;
    border-radius: 8px;
    border: none;
    outline: 3px rgba(9, 9, 174, 0.635);
}

.form-input:focus {
    outline: 3px solid rgba(255, 255, 255, 0.935);
}

.form {
    margin: 0 auto;
    width: 40%;
    border: 1px solid rgba(184, 184, 184, 0.871);
    border-radius: 8px;
    padding: 80px 20px;
}

.form-title {
    text-align: center;
    margin: 0;
    padding: 0;
    color: grey;
}

.form-suggestion {
    color: grey;
    text-align: center;
}

.form-suggestion a {
    color: black;

}</style>
