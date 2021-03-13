import Vue from 'vue';
import VueRouter from 'vue-router';
import userServices from '../services/user.js';

Vue.use(VueRouter);

const userIsLoggedIn = (to, from, next) => {
    let deviceToken = localStorage.getItem('token');
    if(deviceToken === null) {
        next({path: '/login'});
    } else {
        next();
    }
};

const router = new VueRouter({
    history: true,
    routes: [
        {
            path: '/',
            name: 'Home',
            beforeEnter : userIsLoggedIn,
            component: () => import('../views/Home.vue')
        },
        {
            path: '/about',
            name: 'About',
            beforeEnter : userIsLoggedIn,
            component: () => import('../views/About.vue')
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('../views/Login.vue')
        },
        {
            path: '/register',
            name: 'Register',
            component: () => import('../views/Register.vue')
        },
    ]
});


export default router;
