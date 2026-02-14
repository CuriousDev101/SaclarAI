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

  <div class="navbar bg-base-100/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
          <Menu class="h-5 w-5" />
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-100 rounded-box w-52">
          <li><a>Home</a></li>
          <li><a>Features</a></li>
        </ul>
      </div>
      <RouterLink to='/' class="btn btn-ghost normal-case text-xl">
        <span class="font-bold">Scalar<span class="text-primary">AI</span></span>
      </RouterLink>
    </div>
    <div class="navbar-end gap-2">
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
