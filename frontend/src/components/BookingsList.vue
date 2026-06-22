<template>
  <div class="bookings-list">
    <h3>Existing Bookings</h3>
    <table v-if="bookings.length">
      <thead>
        <tr><th>Room ID</th><th>Start</th><th>End</th><th>Actions</th></tr>
      </thead>
      <tbody>
        <tr v-for="booking in bookings" :key="booking.id">
          <td>{{ booking.roomId }}</td>
          <td>{{ formatDate(booking.startTime) }}</td>
          <td>{{ formatDate(booking.endTime) }}</td>
          <td><button @click="emit('delete', booking.id)">🗑️ Delete</button></td>
        </tr>
      </tbody>
    </table>
    <p v-else>No bookings yet.</p>
  </div>
</template>

<script setup lang="ts">
import type { Booking } from '../types';

const props = defineProps<{ bookings: Booking[] }>();
const emit = defineEmits<{ (e: 'delete', id: number): void }>();

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();
</script>