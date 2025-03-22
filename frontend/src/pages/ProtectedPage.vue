<template>
  <q-page class="row items-center justify-evenly">
    <div v-if="isLoggedIn">
      <h4>Welcome user {{ auth.user?.profile.name ?? '<unknown>' }}</h4>
      <h5>Claim 'demo_claim' has value <b> {{ auth.user?.profile.demo_claim ?? '<unknown>' }}</b></h5>
     </div>
    <div v-else>Hmm, the user should be logged in?!</div>
  </q-page>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth-store';

const { isLoggedIn } = useAuthStore();
const auth = useAuthStore();
</script>
