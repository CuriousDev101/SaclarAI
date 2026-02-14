<script setup>
import Footer from '@/components/Footer.vue';
import {
  Menu,
  X,
  Bot,
  Send,
  Upload,
  Globe,
  FileText,
  Zap,
  ArrowRight
} from 'lucide-vue-next'

</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-base-100 to-base-200">
    <!-- Hero Section -->
    <section class="hero min-h-[80vh] bg-base-100/50">
      <div class="hero-content flex-col lg:flex-row-reverse gap-12 max-w-7xl">
        <!-- Chatbot Preview -->
        <div class="lg:w-1/2 relative">
          <div class="card bg-base-100 shadow-2xl border border-primary/20">
            <div class="card-body p-4">
              <!-- Chat Header -->
              <div class="flex items-center gap-2 border-b border-base-300 pb-3">
                <div
                  class="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <Bot :size="16" class="text-white" />
                </div>
                <div>
                  <h3 class="font-medium text-sm">
                    ScalarAI
                    <span v-if="selectedDoc" class="text-xs text-base-content/40 ml-2">
                      • Focused on selected document
                    </span>
                  </h3>
                  <p class="text-xs text-base-content/40"> Ask about any of your documents </p>
                </div>
                <button class="btn btn-ghost btn-xs btn-circle ml-auto">
                  <X class="h-4 w-4" />
                </button>
              </div>

              <!-- Chat Messages -->
              <div class="chat chat-end">
                <div class="chat-image avatar">
                  <div class="w-6 rounded-full bg-primary/10 p-1">
                    <span class="text-xs">👤</span>
                  </div>
                </div>
                <div
                  class="chat-bubble chat-bubble-primary bg-primary/10 text-primary-content border-primary/20 text-sm">
                  What can you tell me about your pricing?
                </div>
              </div>

              <div class="chat chat-start">
                <div class="chat-image avatar">
                  <div
                    class="w-8 rounded-full bg-linear-to-r from-primary to-secondary flex items-center justify-center">
                    <Bot :size="16" class="text-white" />
                  </div>
                </div>
                <div
                  class="chat-bubble chat-bubble-secondary bg-linear-to-r from-primary/10 to-secondary/10 text-base-content border-primary/20 text-sm">
                  We offer flexible pricing plans starting at $29/month. Our RAG-based system can provide detailed
                  information about each plan. Would you like me to explain the differences between Basic, Pro, and
                  Enterprise tiers?
                </div>
              </div>

              <div class="chat chat-end">
                <div class="chat-image avatar">
                  <div class="w-6 rounded-full bg-primary/10 p-1">
                    <span class="text-xs">👤</span>
                  </div>
                </div>
                <div
                  class="chat-bubble chat-bubble-primary bg-primary/10 text-primary-content border-primary/20 text-sm">
                  Yes, please tell me about the Pro plan.
                </div>
              </div>

              <!-- Typing Indicator -->
              <div class="chat chat-start">
                <div class="chat-image avatar">
                  <div
                    class="w-8 rounded-full bg-linear-to-r from-primary to-secondary flex items-center justify-center">
                    <Bot :size="16" class="text-white" />
                  </div>
                </div>
                <div class="chat-bubble chat-bubble-secondary bg-base-200">
                  <div class="flex gap-1">
                    <span class="loading loading-dots loading-xs"></span>
                  </div>
                </div>
              </div>

              <!-- Input Area -->
              <div class="card-footer p-4 bg-base-200/80 backdrop-blur-sm border-t border-base-300">
                <form @submit.prevent="sendMessage" class="flex gap-2">
                  <div class="relative flex-1">
                    <input type="text" v-model="message" placeholder="Ask me anything..."
                      class="input input-bordered rounded-full outline-none w-full pr-12 bg-base-100 focus:border-primary transition-colors"
                      :disabled="loading && !messages[messages.length - 1]?.text" />
                    <button type="submit"
                      class="absolute right-1 top-1/2 -translate-y-1/2 btn btn-circle btn-sm btn-primary"
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

              <!-- Upload Button -->
              <div class="text-xs text-center mt-1">
                <button class="btn btn-ghost btn-xs gap-1">
                  <Upload class="h-3 w-3" />
                  Upload documents for custom Q&A
                </button>
              </div>
            </div>
          </div>

          <!-- Floating Badge -->
          <div
            class="absolute -top-4 -right-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            RAG-Powered
          </div>
        </div>

        <!-- Hero Text -->
        <div class="lg:w-1/2 text-center lg:text-left">
          <h1 class="text-5xl lg:text-6xl font-bold leading-tight">
            Intelligent <span class="text-primary">Website</span> &
            <span class="text-secondary">Document</span> Assistant
          </h1>
          <p class="py-6 text-lg text-base-content/70">
            ScalarAI is a RAG-based chatbot that understands your website content and uploaded documents.
            Get instant, accurate answers from your knowledge base.
          </p>
          <div class="flex gap-4 justify-center lg:justify-start">
            <button class="btn btn-primary btn-lg">Get Started Free</button>
            <button class="btn btn-outline btn-lg">Watch Demo</button>
          </div>
          <div class="mt-8 flex items-center gap-4 justify-center lg:justify-start">
            <div class="avatar-group -space-x-3">
              <div class="avatar">
                <div class="w-8 rounded-full bg-primary/20 flex items-center justify-center">🏢</div>
              </div>
              <div class="avatar">
                <div class="w-8 rounded-full bg-secondary/20 flex items-center justify-center">📄</div>
              </div>
              <div class="avatar">
                <div class="w-8 rounded-full bg-accent/20 flex items-center justify-center">🤖</div>
              </div>
            </div>
            <div class="text-sm text-base-content/60">
              <span class="font-bold text-primary">10k+</span> documents processed
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 px-4 max-w-7xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-4">Why Choose ScalarAI?</h2>
      <p class="text-center text-base-content/70 mb-12 max-w-2xl mx-auto">
        Powered by advanced RAG technology for accurate, context-aware responses
      </p>

      <div class="grid md:grid-cols-3 gap-8">
        <!-- Feature 1 -->
        <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
          <div class="card-body">
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Globe class="h-6 w-6 text-primary" />
            </div>
            <h3 class="card-title">Website Crawling</h3>
            <p class="text-base-content/70">Automatically indexes your entire website for instant Q&A about your
              content.</p>
          </div>
        </div>

        <!-- Feature 2 -->
        <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
          <div class="card-body">
            <div class="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-2">
              <FileText class="h-6 w-6 text-secondary" />
            </div>
            <h3 class="card-title">Document Upload</h3>
            <p class="text-base-content/70">Upload PDFs, Word docs, or text files for custom knowledge base integration.
            </p>
          </div>
        </div>

        <!-- Feature 3 -->
        <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
          <div class="card-body">
            <div class="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
              <Zap class="h-6 w-6 text-accent" />
            </div>
            <h3 class="card-title">Smart Responses</h3>
            <p class="text-base-content/70">RAG technology ensures accurate, contextual answers based on your actual
              content.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-16 px-4 bg-base-200/50">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">How ScalarAI Works</h2>

        <div class="flex flex-col md:flex-row justify-center items-center gap-8">
          <div class="card bg-base-100 w-64">
            <div class="card-body items-center text-center">
              <div
                class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-2">
                1</div>
              <h3 class="font-bold">Connect</h3>
              <p class="text-sm text-base-content/70">Add your website URL or upload documents</p>
            </div>
          </div>
          <div class="text-2xl text-base-content/30 hidden md:block">
            <ArrowRight class="h-6 w-6" />
          </div>
          <div class="card bg-base-100 w-64">
            <div class="card-body items-center text-center">
              <div
                class="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center text-xl font-bold mb-2">
                2</div>
              <h3 class="font-bold">Index</h3>
              <p class="text-sm text-base-content/70">Our RAG system processes and indexes your content</p>
            </div>
          </div>
          <div class="text-2xl text-base-content/30 hidden md:block">
            <ArrowRight class="h-6 w-6" />
          </div>
          <div class="card bg-base-100 w-64">
            <div class="card-body items-center text-center">
              <div
                class="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center text-xl font-bold mb-2">
                3</div>
              <h3 class="font-bold">Chat</h3>
              <p class="text-sm text-base-content/70">Get instant answers from your personalized knowledge base</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer />

  </div>
</template>


<style scoped>
.chat-bubble {
  max-width: 80%;
}

.card {
  transition: all 0.3s ease;
}

.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>
