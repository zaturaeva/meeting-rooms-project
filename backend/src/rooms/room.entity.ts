// src/rooms/room.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Booking } from '../bookings/bookings.entity'; // ← оставляем как есть

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  capacity!: number;

  @OneToMany(() => Booking, (booking) => booking.room)
  bookings!: Booking[];
}