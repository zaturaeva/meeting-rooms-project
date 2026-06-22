<<!-- frontend/src/views/Dashboard.vue -->
<template>
  <div class="dashboard">
    <h2> Meeting Room Booking</h2>

    <!-- Компонент отображения ошибок -->
    <ErrorToast
      :message="errorMessage"
      :type="toastType"
      @clear="clearError"
    />

    <!-- Индикатор загрузки -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>

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
const toastType = ref<'error' | 'success'>('error');
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
    setError(' Failed to load data. Please check if backend is running.', 'error');
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
    const message = err.response?.data?.message || 'Failed to create booking';
    setError(` ${message}`, 'error');
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
    setError(' Failed to delete booking', 'error');
    console.error('Delete booking error:', err);
  } finally {
    loading.value = false;
  }
};

// Установка сообщения
const setError = (message: string, type: 'error' | 'success' = 'error') => {
  errorMessage.value = message;
  toastType.value = type;
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

/* Стили для индикатора загрузки */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(2px);
}

.loading-overlay p {
  color: white;
  font-size: 1.2rem;
  margin-top: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Адаптивность */
@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>