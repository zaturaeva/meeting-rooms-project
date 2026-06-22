<!-- frontend/src/views/Dashboard.vue -->
<template>
  <div class="dashboard">
    <h2>Meeting Room Booking</h2>
    
    <!-- Компонент отображения ошибок -->
    <ErrorToast :message="errorMessage" @clear="clearError" />
    
    <div class="dashboard-grid">
      <div class="left-panel">
        <!-- Список комнат -->
        <RoomsList :rooms="rooms" />
        
        <!-- Форма создания бронирования -->
        <BookingForm 
          :rooms="rooms" 
          @submit="createBooking"
          @error="setError"
        />
      </div>
      
      <div class="right-panel">
        <!-- Список бронирований -->
        <BookingsList 
          :bookings="bookings" 
          :rooms="rooms"
          @delete="deleteBooking" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import RoomsList from '../components/RoomsList.vue';
import BookingForm from '../components/BookingForm.vue';
import BookingsList from '../components/BookingsList.vue';
import ErrorToast from '../components/ErrorToast.vue';
import { roomsApi, bookingsApi } from '../api/bookings';
import type { Room, Booking, CreateBookingDto } from '../types';

// Состояние
const rooms = ref<Room[]>([]);
const bookings = ref<Booking[]>([]);
const errorMessage = ref('');
const loading = ref(false);

// Загрузка данных
const loadData = async () => {
  try {
    loading.value = true;
    const [roomsRes, bookingsRes] = await Promise.all([
      roomsApi.getAll(),
      bookingsApi.getAll(),
    ]);
    rooms.value = roomsRes.data;
    bookings.value = bookingsRes.data;
  } catch (err: any) {
    setError(' Failed to load data. Please check if backend is running.');
    console.error('Load data error:', err);
  } finally {
    loading.value = false;
  }
};

// Создание бронирования
const createBooking = async (dto: CreateBookingDto) => {
  try {
    loading.value = true;
    await bookingsApi.create(dto);
    await loadData();
    setError(' Booking created successfully!', 'success');
  } catch (err: any) {
    const message = err.response?.data?.message || 'Booking failed';
    setError(` ${message}`);
    console.error('Create booking error:', err);
  } finally {
    loading.value = false;
  }
};

// Удаление бронирования
const deleteBooking = async (id: number) => {
  if (!confirm('Are you sure you want to delete this booking?')) {
    return;
  }
  
  try {
    loading.value = true;
    await bookingsApi.delete(id);
    await loadData();
    setError(' Booking deleted successfully!', 'success');
  } catch (err: any) {
    setError(' Failed to delete booking');
    console.error('Delete booking error:', err);
  } finally {
    loading.value = false;
  }
};

// Установка сообщения (ошибка или успех)
const setError = (message: string, type: 'error' | 'success' = 'error') => {
  errorMessage.value = message;
  // Автоматически скрыть через 5 секунд
  setTimeout(() => {
    errorMessage.value = '';
  }, 5000);
};

// Очистка сообщения
const clearError = () => {
  errorMessage.value = '';
};

// Загрузка при монтировании
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard h2 {
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.left-panel {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.right-panel {
  min-height: 400px;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>