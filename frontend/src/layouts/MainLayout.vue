<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>OIDC (OAUTH2) with quasar vue.js 3 </q-toolbar-title>

        <LoginLogout />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-btn @click="auth.logout" style="color: orange">Force logout (debug)</q-btn>
      <q-tabs
        vertical
        class="bg-grey-2 text-black shadow-1"
        active-color="primary"
        indicator-color="primary"
        align="left"
        dense
      >
        <q-route-tab to="/unprotected">unprotected page</q-route-tab>
        <q-route-tab to="/protected">protected page</q-route-tab>
        <q-route-tab to="/authdetail">OIDC details</q-route-tab>
      </q-tabs>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoginLogout from 'src/components/LoginLogout.vue';
import { useAuthStore } from '../stores/auth-store';

const auth = useAuthStore();

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
