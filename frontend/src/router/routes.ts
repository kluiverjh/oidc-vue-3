import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), meta: { requiresAuth: false } },
      {
        path: '/unprotected',
        component: () => import('pages/NotProtectedPage.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: '/protected',
        component: () => import('pages/ProtectedPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/authdetail',
        component: () => import('pages/AuthDetailPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  // Routes for callback IPD (keycloak)
  {
    path: '/login-callback',
    component: () => import('pages/LoginCallback.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/logout-callback',
    component: () => import('pages/LogoutCallback.vue'),
    meta: { requiresAuth: false },
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: { requiresAuth: false },
  },
];
/*
router.beforeEach(async (to, _, next) => {
  if (to.meta.requiresAuth) {
    const user = await authService.getUser();
    if (user && !user.expired) {
      next();
    } else {
      authService.login();
    }
  } else {
    next();
  }
});

*/

export default routes;
