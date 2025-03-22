<template>
  <!-- This page is invoked by Identity Provider after successfull logout (redirect url) -->
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="q-pa-md flex flex-center">
        <div>
          <h4>Successfully logout of keycloak</h4>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useAuthStore } from '../stores/auth-store';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  await authStore.handleLogoutCallback();
  await router.replace('/');
});
</script>
