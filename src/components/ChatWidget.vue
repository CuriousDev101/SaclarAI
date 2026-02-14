<script setup lang="ts">
import { ref, nextTick, computed, watch } from 'vue';
import { Send, MessageCircle, X, FileText, Bot, User, Sparkles, ChevronDown, Loader2 } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/useAuthStore';
import MarkdownRender from 'markstream-vue'

const props = defineProps<{
  embedded?: boolean;
}>();

const open = ref(props.embedded || false);
const message = ref('');
const messages = ref<{ text: string; sender: 'user' | 'bot'; sources?: string[] }[]>([]);
const loading = ref(false);
const authStore = useAuthStore();
const messagesContainer = ref<HTMLElement | null>(null);
const showScrollButton = ref(false);

const isOpen = computed(() => props.embedded || open.value);

const toggleChat = () => {
  if (props.embedded) return;
  open.value = !open.value;
  if (open.value) {
    nextTick(scrollToBottom);
  }
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: 'smooth'
    });
  }
}

const handleScroll = () => {
  if (!messagesContainer.value) return;
  const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value;
  const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
  showScrollButton.value = !isNearBottom;
};

watch(messages, () => {
  nextTick(scrollToBottom);
}, { deep: true });

const sendMessage = async () => {
  if (!message.value.trim() || loading.value) return;

  const userMessage = message.value;
  messages.value.push({ text: userMessage, sender: 'user' });
  message.value = '';
  loading.value = true;

  const botMessageIndex = messages.value.push({ text: '', sender: 'bot', sources: [] }) - 1;
  nextTick(scrollToBottom);

  try {
    const token = authStore.token;
    const response = await fetch('http://localhost:3000/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: userMessage })
    });

    if (!response.body) throw new Error('No response body');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let partialData = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      partialData += chunk;

      const lines = partialData.split('\n\n');
      partialData = lines.pop() || '';

      for (const chunkBlock of lines) {
        const linesInBlock = chunkBlock.split('\n');
        let currentEvent = '';

        for (const line of linesInBlock) {
          if (line.startsWith('event: ')) {
            currentEvent = line.replace('event: ', '').trim();
          } else if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (!dataStr) continue;

            try {
              const data = JSON.parse(dataStr);

              if (currentEvent === 'sources' || Array.isArray(data)) {
                messages.value[botMessageIndex]!.sources = data;
              } else if (currentEvent === 'content' || data.text) {
                messages.value[botMessageIndex]!.text += data.text;
              } else if (currentEvent === 'error' || data.error) {
                messages.value[botMessageIndex]!.text = "Error: " + data.error;
              }
            } catch (e) {
              console.error('Failed to parse SSE data', e, 'Data string:', dataStr);
            }
          }
        }
      }
      scrollToBottom();
    }

  } catch (error) {
    console.error(error);
    if (messages.value[botMessageIndex]) {
      messages.value[botMessageIndex].text = 'Sorry, I encountered an error. Please try again.';
    }
  } finally {
    loading.value = false;
    nextTick(scrollToBottom);
  }
};

const suggestedQuestions = [
  "What documents do I have access to?",
  "How do I upload new documents?",
  "Can you summarize my recent uploads?",
  "What features are available?"
];

const askSuggestedQuestion = (question: string) => {
  message.value = question;
  sendMessage();
};
</script>

<template>
  <div :class="[embedded ? 'w-full h-full' : 'fixed bottom-4 right-4 z-50']">
    <!-- Chat Toggle Button (Floating) -->
    <button v-if="!embedded && !isOpen" @click="toggleChat"
      class="btn btn-primary btn-circle btn-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group">
      <MessageCircle :size="28" class="group-hover:rotate-12 transition-transform" />
    </button>

    <!-- Chat Window -->
    <div v-show="isOpen" :class="[
      'card bg-base-100 shadow-2xl border border-primary/20 flex flex-col transition-all duration-300',
      embedded ? 'w-full h-full rounded-none border-0' : 'w-80 sm:w-96 h-150 rounded-2xl'
    ]">
      <!-- Header -->
      <div
        class="card-header p-4 bg-linear-to-r from-primary/10 to-secondary/10 border-b border-base-300 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="flex items-center">
            <div
              class="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <Bot :size="20" />
            </div>
          </div>
          <div>
            <h3 class="font-bold flex items-center gap-1">
              ScalarAI
              <Sparkles :size="14" class="text-secondary" />
            </h3>
            <p class="text-xs text-base-content/60 flex items-center gap-1">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              Online • Ask about any of your documents
            </p>
          </div>
        </div>
        <button v-if="!embedded" @click="toggleChat"
          class="btn btn-ghost btn-sm btn-circle hover:rotate-90 transition-transform">
          <X :size="18" />
        </button>
      </div>

      <!-- Messages Container -->
      <div class="card-body p-4 flex-1 overflow-y-auto bg-base-100/50" :class="{ 'h-96': !embedded }"
        ref="messagesContainer" @scroll="handleScroll">
        <!-- Empty State -->
        <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center p-4">
          <div
            class="w-20 h-20 rounded-full bg-linear-to-r from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
            <Bot :size="40" class="text-primary" />
          </div>
          <h3 class="font-bold text-lg mb-2">How can I help you today?</h3>
          <p class="text-sm text-base-content/60 mb-6">Ask me anything about your documents or the platform</p>

          <!-- Suggested Questions -->
          <div class="grid grid-cols-1 gap-2 w-full">
            <button v-for="(question, idx) in suggestedQuestions" :key="idx" @click="askSuggestedQuestion(question)"
              class="btn btn-outline btn-sm justify-start text-left hover:bg-primary/10 hover:border-primary/30 transition-all">
              <MessageCircle :size="14" class="mr-2" />
              {{ question }}
            </button>
          </div>
        </div>

        <!-- Message Thread -->
        <div v-for="(msg, index) in messages" :key="index" class="mb-4">
          <div :class="['chat', msg.sender === 'user' ? 'chat-end' : 'chat-start']">
            <!-- Avatar -->
            <div class="chat-image avatar" v-if="msg.sender === 'bot'">
              <div class="w-8 rounded-full bg-linear-to-r from-primary to-secondary flex items-center justify-center">
                <Bot :size="16" class="text-white" />
              </div>
            </div>
            <div class="chat-image avatar" v-else>
              <div class="w-8 rounded-full bg-base-300 flex items-center justify-center">
                <User :size="16" class="text-base-content" />
              </div>
            </div>

            <!-- Message Bubble -->
            <div :class="[
              'chat-bubble max-w-[85%]',
              msg.sender === 'user'
                ? 'bg-linear-to-r from-primary to-secondary text-white'
                : 'bg-base-200 text-base-content'
            ]">
              <div class="whitespace-pre-wrap text-sm">
                <MarkdownRender v-if="msg.sender === 'bot'" :content="msg.text" :typewriter="true"
                  class="prose prose-sm max-w-none dark:prose-invert" />
                <div v-else>{{ msg.text }}</div>
              </div>

              <!-- Typing Indicator -->
              <span v-if="msg.sender === 'bot' && loading && index === messages.length - 1 && !msg.text"
                class="flex gap-1 mt-1">
                <span class="loading loading-dots loading-xs"></span>
              </span>
            </div>
          </div>

          <!-- Sources Dropdown -->
          <div v-if="msg.sender === 'bot' && msg.sources && msg.sources.length" class="flex justify-start ml-12 mt-1">
            <div class="dropdown dropdown-top">
              <div tabindex="0" role="button"
                class="flex items-center gap-1 text-xs text-base-content/50 hover:text-primary cursor-pointer transition-colors">
                <FileText :size="12" />
                {{ msg.sources.length }} {{ msg.sources.length === 1 ? 'Source' : 'Sources' }}
                <ChevronDown :size="12" />
              </div>
              <div tabindex="0"
                class="dropdown-content z-1 menu p-2 shadow-xl bg-base-100 rounded-box w-72 border border-base-300">
                <div class="p-2 text-xs font-semibold border-b border-base-200">Sources</div>
                <div v-for="(source, i) in msg.sources" :key="i"
                  class="text-xs p-2 hover:bg-base-200 rounded-lg cursor-pointer transition-colors border-b border-base-200 last:border-0"
                  @click="console.log(source)">
                  <span class="line-clamp-2">{{ source }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Scroll to Bottom Button -->
        <button v-if="showScrollButton" @click="scrollToBottom"
          class="absolute bottom-20 right-8 btn btn-circle btn-sm btn-primary shadow-lg animate-bounce">
          <ChevronDown :size="16" />
        </button>
      </div>

      <!-- Input Area -->
      <div class="card-footer p-4 bg-base-200/80 backdrop-blur-sm border-t border-base-300">
        <form @submit.prevent="sendMessage" class="flex gap-2">
          <div class="relative flex-1">
            <input type="text" v-model="message" placeholder="Ask me anything..."
              class="input input-bordered rounded-full outline-none w-full pr-12 bg-base-100 focus:border-primary transition-colors"
              :disabled="loading && !messages[messages.length - 1]?.text" />
            <button type="submit" class="absolute right-1 top-1/2 -translate-y-1/2 btn btn-circle btn-sm btn-primary"
              :disabled="loading && !messages[messages.length - 1]?.text"
              :class="{ 'opacity-50': loading && !messages[messages.length - 1]?.text }">
              <Send :size="14" />
            </button>
          </div>
        </form>
        <p class="text-[10px] text-center text-base-content/40 mt-2">
          ScalarAI may make mistakes. Consider verifying important information.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-body {
  scroll-behavior: smooth;
}

.card-body::-webkit-scrollbar {
  width: 6px;
}

.card-body::-webkit-scrollbar-track {
  background: transparent;
}

.card-body::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.card-body::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.chat-bubble {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loading-dots {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 0.4;
  }

  50% {
    opacity: 1;
  }
}

:deep(.prose) {
  max-width: none;
}

:deep(.prose p) {
  margin: 0;
}

:deep(.prose code) {
  background: rgba(0, 0, 0, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}
</style>
