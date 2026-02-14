<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '../stores/useAuthStore.ts';
import ChatWidget from '@/components/ChatWidget.vue';
import api from "../utils/axios.ts"


const authStore = useAuthStore();

const fetchDocuments = async () => {
  try {
    const response = await api.post("/api/admin/upload", { name: "ada", email: "asfasf" })
    return response.data
  } catch (error) {
    console.error('Failed to upload documents', error);
  }
};

onMounted(() => {
  fetchDocuments()
})
</script>

<template>
  <div class="container mx-auto p-4 h-[calc(100vh-64px)] flex flex-col items-center justify-center">
    <div v-if="!authStore.isAuthenticated" class="text-center">
      <h2 class="text-2xl font-bold mb-4">Please login to chat</h2>
      <router-link to="/login" class="btn btn-primary">Login</router-link>
    </div>
    <div v-else
      class="w-full max-w-4xl h-full bg-base-100 rounded-xl shadow-xl overflow-hidden border border-gray-800 relative">
      <chat-widget :embedded="true" />
    </div>
  </div>
</template>
