<script setup>
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { ref, reactive, watch, onMounted, onBeforeMount } from 'vue';
import { useAuthStore } from './stores/counter';

const store = useAuthStore();

onMounted(() => {
  console.log(store.authUser)

})
</script>

<template>
  <div class="container">
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<style>
@import 'primeicons/primeicons.css';

:root {
  --main-color:  rgba(40, 111, 0, 0.1)
}

*,
a {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.body {
  position: relative;
  font-family:Georgia, 'Times New Roman', Times, serif;
}



body {
  background-color: var(--main-color)
}

/**
to auth nav

**/
.nav {
  display: none;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  gap: 30px;
  text-align: center;
}

.nav-button {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 24px;
  width: 20px;
  border-radius: 50%;
  background-color: rgba(50, 15, 165, 1);
  color: rgb(6, 6, 6);
}

.pi-sign-out {
  color: rgb(164, 10, 10);
  justify-self: center;
}

.auth-buttons {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

.auth-buttons .btn {
  color: black;
  border: none;
}

.auth-buttons .btn.btn--signout {
  align-self: flex-end;
}

body {
  background-color: rgb(255, 255, 255);
}

.wrapper {
  position: relative;
  margin: 0 auto;
  padding: 0 50px;
  border-radius: 8px;
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}


.nav a {
  color: rgb(255, 255, 255);
  text-decoration: none;
  border-bottom: 1px solid black;
}

.btn {
  border: none;
  padding: 10px 40px;
  color: white;
  font-weight: bold;
  border-radius: 20px;
}

.btn--signout {
  background-color: brown;
}

.btn--message {
  background-color: blue;
}

.btn--follow {
  background-color: rgb(248, 248, 248);
  border: 2px solid rgba(57, 57, 227, 0.741);
  color: rgba(0, 0, 0, 0.789);
}

.btn--post {
  background-color: rgb(248, 248, 248);
  border: 2px solid rgba(8, 8, 8, 0.741);
  color: rgba(0, 0, 0, 0.789);
  align-self: flex-end;
}




@media (max-width: 768px) {
}
</style>
