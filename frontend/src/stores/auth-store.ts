// src/stores/authStore.ts
import { defineStore } from 'pinia';
import { authService } from 'src/auth/authService';
import { type User } from 'oidc-client-ts';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: undefined as User | undefined,
  }),

  getters: {
    service: () => authService, // exposes authService directly
    isLoggedIn: (state) => !!state.user,
    username: (state) => state.user?.profile?.preferred_username || state.user?.profile?.name || '',
    expires_at: (state) =>
      state.user?.expires_at ? new Date(state.user?.expires_at * 1000) : undefined,
  },

  actions: {
    // Invokes login in keycloak (loginscreen keycloak)
    async login() {
      await authService.signinRedirect();
    },

    // Invokes logout in keycloak
    async logout() {
      await authService.signoutRedirect();
      this.user = undefined;
    },

    async handleLoginCallback() {
      try {
        const oidcUser = await authService.completeSignIn();
        this.user = oidcUser;
      } catch (e: unknown) {
        console.error('[handleLogoutCallback] Logout failed:', e);
      }
    },

    // Complete logout after keycloak invoked callback
    async handleLogoutCallback() {
      try {
        // TODO: logout returns a response with status
        await authService.completeSignOut();
      } catch (e: unknown) {
        console.error('[handleLogoutCallback] Logout failed:', e);
      }
      this.user = undefined;
    },

    async checkUserSession() {
      const currentUser = await authService.getUser();
      if (currentUser && !currentUser.expired) {
        this.user = currentUser;
      }
    },
  },
});
