<template>
  <form @submit.prevent="handleSubmit" class="booking-form">
    <h3>New Booking</h3>
    <div>
      <label>Room</label>
      <select v-model="form.roomId" required>
        <option v-for="room in rooms" :key="room.id" :value="room.id">
          {{ room.name }}
        </option>
      </select>
    </div>
    <div>
      <label>Start Time</label>
      <input type="datetime-local" v-model="form.startTime" required />
    </div>
    <div>
      <label>End Time</label>
      <input type="datetime-local" v-model="form.endTime" required />
    </div>
    <button type="submit">Book</button>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import type { Room, CreateBookingDto } from '../types';

const props = defineProps<{ rooms: Room[] }>();
const emit = defineEmits<{ (e: 'submit', data: CreateBookingDto): void }>();

const form = reactive<CreateBookingDto>({
  roomId: 0,
  startTime: '',
  endTime: '',
});

const handleSubmit = () => {
  if (form.roomId && form.startTime && form.endTime) {
    emit('submit', { ...form });
    form.roomId = 0;
    form.startTime = '';
    form.endTime = '';
  }
};
</script>