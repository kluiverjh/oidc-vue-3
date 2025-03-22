import { Notify } from 'quasar';
import type { SignoutResponse } from 'oidc-client-ts';
import {
  UserManager,
  type UserManagerSettings,
  WebStorageStateStore,
  type User,
} from 'oidc-client-ts';
import { Log } from 'oidc-client-ts';

// see https://authts.github.io/oidc-client-ts/

// Normally the oidcConfig is retreived from backend with REST API get call
// Keycloak is not access directly from web application, it also common to use a proxy on backend (CORS)

const oidcConfig: UserManagerSettings = {
  authority: 'http://localhost:8080/realms/demo', // identity provider URL
  client_id: 'c2sim-dashboard-client',
  response_type: 'code', // Use 'code' for OAuth2 authorization code flow
  scope: 'openid profile email phone', // Scopes you want to request ('openid' value is mandatory when retreiving user info)
  redirect_uri: `${window.location.origin}/login-callback`, // Redirect URI after login
  post_logout_redirect_uri: `${window.location.origin}/logout-callback`,
  silent_redirect_uri: window.location.origin + '/silent-renew', // no SPA routing interference for this page
  automaticSilentRenew: true, // renew token
  monitorSession: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  loadUserInfo: true, // fetch profile information
  accessTokenExpiringNotificationTimeInSeconds: 180,
};

import { useAuthStore } from '../stores/auth-store';

export class AuthService {
  private userManager: UserManager;

  constructor() {
    console.log('AuthService created');
    Log.setLevel(Log.DEBUG);
    Log.setLogger(console);
    this.userManager = new UserManager(oidcConfig);

    this.userManager.events.addUserLoaded(async () => {
      // console.warn('User loaded...');
      // Is invoked when token is renewed
      const authStore = useAuthStore();
      await authStore.checkUserSession(); // Update user state in store
    });

    this.userManager.events.addUserSignedIn(() => {
      console.warn('Signed in...');
    });
    // Automatic token renewal
    this.userManager.events.addAccessTokenExpired(async () => {
      console.warn('Access token expired, attempting silent sign-in...');
      await this.renewToken();
    });

    this.userManager.events.addSilentRenewError((err) => {
      console.error('Silent renew error', err);
    });

    this.userManager.events.addAccessTokenExpired(() => {
      console.warn('Access token expired!');
    });

    this.userManager.events.addAccessTokenExpiring(() => {
      console.log('Access token is about to expire');
    });
  }
  /*
  async login(): Promise<User | null> {
    try {
      const user = await this.userManager.getUser();
      if (!user) {
        await this.signinRedirect();
      }
      return user;
    } catch (error) {
      this.showError('Sign-in error:', error);
      return null;
    }
  }
*/
  // Keycloak called redirect url (callback) after login, complete the process (get user info)
  async completeSignIn(): Promise<User | undefined> {
    try {
      const user = await this.userManager.signinCallback();

      return user;
    } catch (error) {
      this.showError('Error completing sign-in:', error);
      return undefined;
    }
  }

  // Keycloak called redirect url (callback) after logout, complete the process
  async completeSignOut(): Promise<SignoutResponse | undefined> {
    try {
      return await this.userManager.signoutCallback();
    } catch (error) {
      this.showError('Error completing sign-in:', error);
      return undefined;
    }
  }

  async renewToken(): Promise<void> {
    try {
      const user = await this.userManager.signinSilent();
      console.log('Token successfully renewed:', user);
    } catch (error) {
      this.showError('Silent renewal failed:', error);
      // await this.signIn(); // Redirect to login if renewal fails
    }
  }

  async getUser(): Promise<User | null> {
    return await this.userManager.getUser(false);
  }
  async signOut(): Promise<void> {
    await this.userManager.signoutRedirect();
  }

  // This method redirects the user to the authentication server's login page
  async signinRedirect(): Promise<void> {
    // Optional: show message for redirect to keycloak
    Notify.create({
      progress: true,
      timeout: 4000,
      message: 'Login required! Redirect to keycloak.',
      color: 'primary',
    });
    // Wait for x seconds
    await new Promise((resolve) => setTimeout(resolve, 4000));

    await this.userManager.signinRedirect();
  }

  async signoutRedirect(): Promise<void> {
    await this.userManager.signoutRedirect();
  }

  async signInCallback(): Promise<User | undefined> {
    return await this.userManager.signinCallback();
  }

  showError(errorText: string, error: unknown) {
    Notify.create({
      message: `${errorText} (${JSON.stringify(error)})`,
      caption: 'Error',
      type: 'negative',
    });
    console.error(errorText, error);
  }
}

export const authService = new AuthService();
