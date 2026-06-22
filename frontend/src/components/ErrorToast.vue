<!-- frontend/src/components/ErrorToast.vue -->
<template>
  <Transition name="fade">
    <div v-if="message" :class="['toast', type]">
      <span class="toast-icon">{{ type === 'success' ? 'yes' : 'no' }}</span>
      <span class="toast-message">{{ message }}</span>
      <button @click="$emit('clear')" class="toast-close">×</button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{ 
  message: string;
  type?: 'error' | 'success';
}>();

defineEmits<{ (e: 'clear'): void }>();
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  color: white;
  padding: 14px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  max-width: 450px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  min-width: 200px;
  backdrop-filter: blur(4px);
}

.toast.error {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.toast.success {
  background: linear-gradient(135deg, #27ae60, #1e8449);
}

.toast-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 4px;
  opacity: 0.7;
  transition: opacity 0.2s;
  line-height: 1;
}

.toast-close:hover {
  opacity: 1;
}

/* Анимации */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>