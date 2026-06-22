<!-- frontend/src/components/BookingForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="booking-form">
    <h3>New Booking</h3>
    
    <div class="form-group">
      <label>Room</label>
      <select v-model="form.roomId" required>
        <option value="">Select a room</option>
        <option v-for="room in rooms" :key="room.id" :value="room.id">
          {{ room.name }} ({{ room.capacity }} people)
        </option>
      </select>
    </div>
    
    <div class="form-group">
      <label>Start Time</label>
      <input type="datetime-local" v-model="form.startTime" required />
    </div>
    
    <div class="form-group">
      <label>End Time</label>
      <input type="datetime-local" v-model="form.endTime" required />
    </div>
    
    <!-- Отображение ошибки валидации -->
    <div v-if="validationError" class="error-message">
      {{ validationError }}
    </div>
    
    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Booking...' : 'Book Room' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { Room, CreateBookingDto } from '../types';

const props = defineProps<{ rooms: Room[] }>();
const emit = defineEmits<{ 
  (e: 'submit', data: CreateBookingDto): void;
  (e: 'error', message: string): void;
}>();

const form = reactive<CreateBookingDto>({
  roomId: 0,
  startTime: '',
  endTime: '',
});

const isSubmitting = ref(false);
const validationError = ref('');

// Функция валидации формы
const validateForm = (): string | null => {
  if (!form.roomId) return 'Please select a room';
  if (!form.startTime || !form.endTime) return 'Please fill all fields';
  
  const start = new Date(form.startTime);
  const end = new Date(form.endTime);
  
  if (start >= end) {
    return 'End time must be after start time';
  }
  if (start < new Date()) {
    return 'Cannot book in the past';
  }
  
  return null;
};

// Обработчик отправки формы
const handleSubmit = () => {
  const error = validateForm();
  if (error) {
    validationError.value = error;
    emit('error', error);
    // Скрыть ошибку через 3 секунды
    setTimeout(() => {
      validationError.value = '';
    }, 3000);
    return;
  }
  
  isSubmitting.value = true;
  emit('submit', { ...form });
  
  // Сброс формы
  form.roomId = 0;
  form.startTime = '';
  form.endTime = '';
  isSubmitting.value = false;
};
</script>

<style scoped>
.booking-form {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  max-width: 400px;
}
.booking-form h3 {
  margin-top: 0;
  color: #2c3e50;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: 500;
}
.form-group select,
.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}
.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: #fde8e8;
  border-radius: 4px;
}
button {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
}
button:hover:not(:disabled) {
  background: #2980b9;
}
button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}
</style>