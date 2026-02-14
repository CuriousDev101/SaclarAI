<script setup lang="ts">
import router from '@/router';
import { useAuthStore } from '@/stores/useAuthStore';
import { computed } from 'vue';

const authStore = useAuthStore()

const name = computed(() => {
  return authStore.user?.name ? authStore.user.name.split(" ")[0] : '';
});

const logout = () => {
  authStore.logout()
  router.push("/login");
}
</script>

<template>
  <div class="navbar bg-base-100 border-b border-gray-800">
    <div class="flex-1">
      <RouterLink to="/" class="btn btn-ghost text-xl">ScalarAI</RouterLink>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <li v-if="!authStore.isAuthenticated">
          <RouterLink to="/login">Login</RouterLink>
        </li>
        <li v-if="!authStore.isAuthenticated">
          <RouterLink to="/signup">Signup</RouterLink>
        </li>
        <li v-if="authStore.isAuthenticated">
          <RouterLink to="/admin">Knowledge</RouterLink>
        </li>
        <li v-if="authStore.isAuthenticated">
          <RouterLink to="/chat">Chat</RouterLink>
        </li>
        <li v-if="authStore.isAuthenticated" class="mr-5">
          <details>
            <summary>
              {{ name?.toUpperCase() }}
            </summary>
            <ul class="p-2 bg-base-100 rounded-t-none">
              <li><a @click="logout">Logout</a></li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
  </div>
</template>
