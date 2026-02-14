<!-- views/Documents.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/useAuthStore.ts';
import ChatWidget from '@/components/ChatWidget.vue';
import api from "../utils/axios.ts";
import {
  FileText,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  Database,
  BookOpen,
  Filter,
  X,
  ChevronRight,
  Loader2
} from 'lucide-vue-next';

const authStore = useAuthStore();
const documents = ref<{ id: number; filename: string; createdAt: string; size?: number; status?: string }[]>([]);
const loading = ref(false);
const searchQuery = ref('');
const selectedDoc = ref<number | null>(null);
const filterStatus = ref('all');

const fetchDocuments = async () => {
  loading.value = true;
  try {
    const response = await api.get('/api/admin/documents', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    // Add mock data for demo - replace with actual API response
    documents.value = response.data.map((doc: any, index: number) => ({
      ...doc,
      status: ['processed', 'processed', 'processed', 'pending'][index % 4] || 'processed',
      size: Math.floor(Math.random() * 1000000) + 10000
    }));
  } catch (error) {
    console.error('Failed to fetch documents', error);
  } finally {
    loading.value = false;
  }
};

const filteredDocuments = computed(() => {
  let filtered = documents.value.filter(doc =>
    doc.filename.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(doc => doc.status === filterStatus.value);
  }

  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
});

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'processed': return CheckCircle;
    case 'pending': return Clock;
    case 'failed': return AlertCircle;
    default: return FileText;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'processed': return 'text-success';
    case 'pending': return 'text-warning';
    case 'failed': return 'text-error';
    default: return 'text-base-content/40';
  }
};

const selectDocument = (id: number) => {
  selectedDoc.value = selectedDoc.value === id ? null : id;
};

onMounted(() => {
  fetchDocuments();
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
    <!-- Header -->
    <div class="bg-base-100/80 backdrop-blur-sm sticky top-0 z-40 border-b border-base-300">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <BookOpen :size="20" class="text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold">Document Explorer</h1>
            <p class="text-sm text-base-content/60">Browse and chat with your documents</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!authStore.isAuthenticated" class="container mx-auto p-8 text-center">
      <div class="max-w-md mx-auto">
        <div
          class="w-24 h-24 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
          <BookOpen :size="40" class="text-primary" />
        </div>
        <h2 class="text-3xl font-bold mb-4">Please login to continue</h2>
        <p class="text-base-content/60 mb-8">Login to access your documents and start chatting with ScalarAI</p>
        <router-link to="/login" class="btn btn-primary btn-lg gap-2">
          <ChevronRight :size="18" />
          Login to Chat
        </router-link>
      </div>
    </div>

    <div v-else class="container mx-auto p-4 h-[calc(100vh-80px)]">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
        <!-- Document List Sidebar -->
        <div
          class="lg:col-span-5 xl:col-span-4 bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden flex flex-col">
          <!-- Sidebar Header -->
          <div class="p-4 border-b border-base-300 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div class="flex items-center justify-between mb-3">
              <h2 class="font-bold flex items-center gap-2">
                <Database :size="18" class="text-primary" />
                Your Documents
                <span class="badge badge-primary badge-sm">{{ filteredDocuments.length }}</span>
              </h2>
              <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-xs btn-circle">
                  <Filter :size="14" />
                </label>
                <div tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-36">
                  <li><a :class="{ 'bg-primary/10': filterStatus === 'all' }" @click="filterStatus = 'all'">All</a></li>
                  <li><a :class="{ 'bg-primary/10': filterStatus === 'processed' }"
                      @click="filterStatus = 'processed'">Processed</a></li>
                  <li><a :class="{ 'bg-primary/10': filterStatus === 'pending' }"
                      @click="filterStatus = 'pending'">Pending</a></li>
                </div>
              </div>
            </div>

            <!-- Search -->
            <div class="form-control">
              <div class="relative">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/40" />
                <input type="text" v-model="searchQuery" placeholder="Search documents..."
                  class="input input-sm input-bordered w-full pl-9 pr-8" />
                <button v-if="searchQuery" @click="searchQuery = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 btn btn-xs btn-ghost btn-circle">
                  <X :size="12" />
                </button>
              </div>
            </div>
          </div>

          <!-- Document List -->
          <div class="flex-1 overflow-y-auto p-3">
            <div v-if="loading" class="flex items-center justify-center h-32">
              <Loader2 class="h-6 w-6 animate-spin text-primary" />
            </div>

            <div v-else-if="filteredDocuments.length === 0" class="text-center py-12">
              <FileText class="h-12 w-12 mx-auto text-base-content/20 mb-3" />
              <p class="text-base-content/60 text-sm">No documents found</p>
              <router-link to="/admin" class="btn btn-primary btn-sm mt-4">
                Upload Documents
              </router-link>
            </div>

            <div v-else class="space-y-2">
              <div v-for="doc in filteredDocuments" :key="doc.id" @click="selectDocument(doc.id)"
                class="p-3 rounded-xl border cursor-pointer transition-all duration-200" :class="[
                  selectedDoc === doc.id
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-base-300 hover:border-primary/30 hover:bg-base-200/50'
                ]">
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0">
                    <div
                      class="w-8 h-8 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center">
                      <component :is="getStatusIcon(doc.status || '')" :size="16"
                        :class="getStatusColor(doc.status || '')" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-sm truncate">{{ doc.filename }}</h3>
                    <div class="flex items-center gap-2 mt-1 text-xs text-base-content/40">
                      <span>{{ formatFileSize(doc.size || 0) }}</span>
                      <span>•</span>
                      <span class="flex items-center gap-1">
                        <Clock :size="10" />
                        {{ formatDate(doc.createdAt) }}
                      </span>
                    </div>
                  </div>
                  <div class="flex-shrink-0">
                    <span class="badge badge-sm" :class="{
                      'badge-success': doc.status === 'processed',
                      'badge-warning': doc.status === 'pending',
                      'badge-error': doc.status === 'failed'
                    }">
                      {{ doc.status }}
                    </span>
                  </div>
                </div>

                <!-- Quick preview when selected -->
                <div v-if="selectedDoc === doc.id" class="mt-3 pt-3 border-t border-base-300">
                  <p class="text-xs text-base-content/60 line-clamp-2">
                    Document ready for Q&A. Ask questions about this document in the chat.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar Footer -->
          <div class="p-3 border-t border-base-300 bg-base-200/50">
            <router-link to="/admin" class="btn btn-ghost btn-sm w-full gap-2">
              <Upload :size="14" />
              Upload New Documents
            </router-link>
          </div>
        </div>

        <!-- Chat Area -->
        <div
          class="lg:col-span-7 xl:col-span-8 bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden relative">
          <ChatWidget :embedded="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth scrolling */
.overflow-y-auto {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Document card hover effect */
.cursor-pointer {
  transition: all 0.2s ease;
}

/* Loading animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .container {
    height: auto;
    min-height: calc(100vh - 80px);
  }

  .grid {
    grid-template-rows: auto 1fr;
  }
}
</style>
