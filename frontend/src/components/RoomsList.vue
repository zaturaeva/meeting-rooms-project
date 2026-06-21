<template>
  <div class="rooms-list">
    <h3>Meeting Rooms</h3>
    <div class="rooms-grid">
      <div v-for="room in rooms" :key="room.id" class="room-card">
        <h4>{{ room.name }}</h4>
        <p>Capacity: {{ room.capacity }} people</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { roomsApi } from '../api/bookings';
import type { Room } from '../types';

const rooms = ref<Room[]>([]);

onMounted(async () => {
  const response = await roomsApi.getAll();
  rooms.value = response.data;
});
</script>

<style scoped>
.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
.room-card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
}
</style>