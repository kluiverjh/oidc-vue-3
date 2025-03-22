<script setup lang="ts">
import { useAuthStore } from '../stores/auth-store';
const { isLoggedIn, username } = useAuthStore();
const auth = useAuthStore();
</script>

<template>
  <div>
    <button v-if="!isLoggedIn" @click="auth.login">Login</button>
    <button v-else @click="auth.logout">Logout {{ username }}</button>
  </div>
</template>
