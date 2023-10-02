<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/counter';
const route = useRoute();
const store = useAuthStore();

</script>
<template>
    <aside class="aside-content">
        <nav class="aside-nav">
            <ul class="aside-nav-ul">


                <RouterLink to="/home">
                    <li :class="['aside-nav-items', {
                        'active-link-item': route.path === '/home'
                    }]">
                        <span class="pi pi-home"></span>
                        <!-- <span class="nav-text-item">Home</span> -->
                    </li>
                </RouterLink>

                <li class="aside-nav-items">
                    <span class="pi pi-search"></span>
                    <!-- <span class="nav-text-item">Explore</span> -->
                </li>
                <li class="aside-nav-items">
                    <span class="pi pi-bell"></span>
                    <!-- <span class="nav-text-item">Notifications</span> -->
                </li>


                <RouterLink to="/messages">
                    <li class="nav-text-item" :class="['aside-nav-items', {
                        'active-link': route.path === '/messages'
                    }]">
                        <span class="pi pi-envelope"></span>
                        <!-- <span class="nav-text-item">Messages</span> -->
                    </li>
                </RouterLink>

                <li class="aside-nav-items" @click="store.logoutFn">
                    <span class="pi pi-sign-out"></span>
                    <!-- <span class="nav-text-item">Sign Out</span> -->
                </li>
            </ul>
        </nav>
    </aside>
</template>

<style>
.active-link-item {
    background-color: rgba(195, 195, 195, 0.1);
    backdrop-filter: blur(12px);
}

.aside-content {
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 52px;
    left: 0;
    grid-row: 2/ -1;
    grid-column: 1 / 2;
    padding: 10px 5px;

    z-index: 999;
    min-height: 100vh;
}

.aside-nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;

}

.aside-nav-ul {
    display: flex;
    flex-direction: column;
    align-items: center;
    list-style-type: none;
    gap: 60px;
}

.aside-nav-items {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    padding: 20px;
    border-radius: 50%;
    margin-bottom: 20px;
    border-radius: 40px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.aside-nav-items .pi {
    font-size: 24px;
}



.aside-nav-items:hover {
    background-color: rgba(185, 185, 185, 0.3);
}

.active-link {
    font-size: 24px;
    background-color: rgba(185, 185, 185, 0.3);
}

@media (max-width: 640px) {
    .aside-content {
        backdrop-filter: blur(12px);
        min-height: 10px;
        position: sticky;
        bottom: 0;
        margin: 0;
    }
    .aside-nav-ul {
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 0;
        gap: 20px;
        max-height: 60px;
    }

    .aside-nav {
        padding: 0;
        align-items: center;;
    }

    .aside-nav-items {
        margin: 0;
    }

    .aside-nav-items .pi {
        font-size: 18px;
    }
}
</style>