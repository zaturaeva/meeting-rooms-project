// backend/src/bookings/bookings.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from '../rooms/room.entity';

@Entity()
export class Booking {  // ← должен быть экспортирован!
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  roomId!: number;

  @Column()
  startTime!: Date;

  @Column()
  endTime!: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @ManyToOne(() => Room, (room) => room.bookings)
  @JoinColumn({ name: 'roomId' })
  room!: Room;
}