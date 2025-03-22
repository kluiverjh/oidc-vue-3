<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth-store';
import DecodedJwtToken from './DecodedJwtToken.vue';
const { isLoggedIn } = useAuthStore();
const auth = useAuthStore();

const tab = ref("generic")

</script>

<template>
  <div class="q-ma-md">
    <h3>OIDC Detail (debug)</h3>
    <div v-if="isLoggedIn">

        <q-tabs
          v-model="tab"
           align="left"
        >
          <q-tab name="generic" icon="info" label="Generic" />
          <q-tab name="identity_token" icon="info" label="Identity token" />
          <q-tab name="access_token" icon="info" label="Access token" />
          <q-tab name="refresh_token" icon="info" label="Refresh token" />
        </q-tabs>


        <q-tab-panels
          v-model="tab"
          vertical
        >
          <q-tab-panel name="generic">
            <div class="text-h4 q-mb-md">Generic</div>
            <div>Token expires at: {{ auth.user?.expires_at ? new Date(auth.user?.expires_at * 1000).toISOString() : '<not set>' }}</div>

<b>Profile:</b>
<pre>{{ auth.user }}</pre>
          </q-tab-panel>

          <q-tab-panel name="identity_token">
            <div class="text-h4 q-mb-md">Identity token</div>
            <DecodedJwtToken :token="auth.user?.id_token || ''"/>
          </q-tab-panel>

          <q-tab-panel name="access_token">
            <div class="text-h4 q-mb-md">Access token</div>
            <DecodedJwtToken :token="auth.user?.access_token || ''"/>
          </q-tab-panel>
          <q-tab-panel name="refresh_token">
            <div class="text-h4 q-mb-md">Refresh token</div>
            <DecodedJwtToken :token="auth.user?.refresh_token || ''"/>
          </q-tab-panel>
        </q-tab-panels>

    </div>
    <div v-else>
      <h1 style="color: red">User is not logged in!</h1>
    </div>
  </div>
</template>
