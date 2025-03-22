<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth-store';

const authStore = useAuthStore();

onMounted(async () => {
  // This start automatic renewal process timer (request userInfo)
  await authStore.checkUserSession(); // Auto-load user session on refresh
});
</script>
