<template>
  <h6 class="text-xl font-bold mb-2">Decoded JWT Payload (no header and signature)</h6>
  <div v-if="payload">
    <ul class="space-y-1">
      <li v-for="(value, key) in payload" :key="key">
        <strong>{{ key }}:</strong> {{ value }}
      </li>
    </ul>
  </div>
  <div v-else class="text-red-600">Invalid token or decoding failed.</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { jwtDecode } from 'jwt-decode';

const props = defineProps<{
  token: string;
}>();

const payload = computed(() => {
  try {
    return jwtDecode<Record<string, unknown>>(props.token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
});
</script>

<style scoped>
ul {
  list-style: disc;
  padding-left: 1.2rem;
}
</style>
