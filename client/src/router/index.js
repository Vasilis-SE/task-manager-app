import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('../views/Login.vue')
        },
        {
            path: '/about',
            name: 'About',
            component: () => import('../views/About.vue')
        }
    ]
});

router.beforeEach((to, from, next) => {
    if(!isAuthenticated) next({path: '/login'});
    else next();
});

export default router;
