<template>
  <!-- This page is invoked by Identity Provider after successfull login (redirect url) -->
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="q-pa-md flex flex-center">
        <div>
          <h4>Login process with keycloak finished</h4>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth-store';

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  await authStore.handleLoginCallback();
  await router.replace('/');
  // If state contains the url path:
  // const { state } = await authStore.service.signInRedirectCallback();
  // router.replace(state?.target || '/');
});
</script>
