import { createRouter, createWebHistory, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/counter';
import { auth } from '../firebase/firebase';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/LogIn.vue')
    },
    {
      path: '/signin',
      name: 'signin',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: import('../components/Register.vue')
    },
    {
      path: '/home',
      name: 'Home',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Home.vue'),
      meta: {
        requiresAuth: true,
      },

    }, {
    
        path: '/messages/:id?',
        name: 'messages',
        component: () => import('../components/Dummy.vue'),
   
    },
    {
      path: '/user/:id',
      name: 'User',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/UserPage.vue'),
    }
  ]
});


// router.beforeEach((to, from, next) => {
//   const store = useAuthStore();
//   const localUser = JSON.parse(localStorage.getItem('authUser'))
//   if(to.meta.requiresAuth) {
//     if(store.authUser.uid || localUser){
//       next('/home')
//     }
//   } else {
//     next();
//   }
// })
export default router
