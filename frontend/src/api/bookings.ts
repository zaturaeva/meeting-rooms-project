import apiClient from './client';
import type { Room, Booking, CreateBookingDto } from '../types';

export const roomsApi = {
  getAll: () => apiClient.get<Room[]>('/rooms'),
};

export const bookingsApi = {
  getAll: () => apiClient.get<Booking[]>('/bookings'),
  create: (dto: CreateBookingDto) => apiClient.post<Booking>('/bookings', dto),
  delete: (id: number) => apiClient.delete(`/bookings/${id}`),
};