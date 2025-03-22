import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from '../stores/auth-store';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
    linkActiveClass: 'border-indigo-500',
    linkExactActiveClass: 'border-indigo-700',
  });

  // Check each navigation request if authentication is required
  // There should always also be a authentication check on the backend REST API (web app can be bypassed)
  Router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // If the route requires authentication and user is not logged in
    if (to.meta.requiresAuth) {
      // Load the user from the UserManager if it's not already loaded
      if (!authStore.user) {
        await authStore.checkUserSession();
      }
      // If therer is no user login
      if (!authStore.user) {
        await authStore.login();
      } else {
        next(); // User is logged in!
      }

      // Add path to redirect url, to return directly to requested page
      // .signInRedirect({ state: { target: to.fullPath } });

      // Don't call `next()` after redirect
    } else {
      next();
    }
  });
  return Router;
});
