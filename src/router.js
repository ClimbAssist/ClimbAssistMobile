import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import Frame from '@/views/Frame';
import Mapgl from '@/views/Map';
import List from '@/views/List';
import Area from '@/views/Area';
import Terms from '@/views/Terms';
import FileTest from '@/components/FileTest';
import Downloads from '@/views/Downloads';
import User from '@/views/User';
import Contact from '@/views/Contact';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '*',
      name: 'Home',
      component: Home,
    },
    {
      path: '/map',
      name: 'map',
      component: Mapgl,
    },
    {
      path: '/list',
      name: 'list',
      component: List,
    },
    {
      path: '/terms-and-conditions',
      name: 'terms-and-conditions',
      component: Terms,
    },
    {
      path: '/file-test',
      name: 'file-test',
      component: FileTest,
    },
    {
      path: '/downloads',
      name: 'downloads',
      component: Downloads,
    },
    {
      path: '/area',
      name: 'area',
      component: Area,
    },
    {
      path: '/frame',
      name: 'frame',
      component: Frame,
    },
    {
      path: '/user',
      name: 'user',
      component: User,
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact,
    },
  ],
});

// router.beforeEach((to, from, next) => {
//   if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
//   else next()
// })
