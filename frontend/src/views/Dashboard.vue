
<template>
  <div class="dashboard">
    <RoomsList />
    <BookingForm :rooms="rooms" @submit="createBooking" />
    <BookingsList :bookings="bookings" @delete="deleteBooking" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import RoomsList from '../components/RoomsList.vue';
import BookingForm from '../components/BookingForm.vue';
import BookingsList from '../components/BookingsList.vue';
import { roomsApi, bookingsApi } from '../api/bookings';
import type { Room, Booking, CreateBookingDto } from '../types';

const rooms = ref<Room[]>([]);
const bookings = ref<Booking[]>([]);
const errorMessage = ref('');

const loadData = async () => {
  const [roomsRes, bookingsRes] = await Promise.all([
    roomsApi.getAll(),
    bookingsApi.getAll(),
  ]);
  rooms.value = roomsRes.data;
  bookings.value = bookingsRes.data;
};

const createBooking = async (dto: CreateBookingDto) => {
  try {
    await bookingsApi.create(dto);
    await loadData();
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Booking failed';
    setTimeout(() => (errorMessage.value = ''), 3000);
  }
};

const deleteBooking = async (id: number) => {
  if (confirm('Delete this booking?')) {
    await bookingsApi.delete(id);
    await loadData();
  }
};

onMounted(loadData);
</script>