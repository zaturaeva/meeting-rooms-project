<!-- frontend/src/components/ErrorToast.vue -->
<template>
  <Transition name="fade">
    <div v-if="message" :class="['toast', type]">
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
  top: 20px;
  right: 20px;
  color: white;
  padding: 14px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-width: 450px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  min-width: 200px;
}

.toast.error {
  background: #e74c3c;
}

.toast.success {
  background: #27ae60;
}

.toast-message {
  flex: 1;
}

.toast-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 4px;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.toast-close:hover {
  opacity: 1;
}

/* Анимации */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
</style>