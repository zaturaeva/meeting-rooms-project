// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { RoomsModule } from './rooms/rooms.module'; // ← правильный путь
import { BookingsModule } from './bookings/bookings.module'; // ← правильный путь

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite' as const,
      database: 'database.sqlite',
      entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
      synchronize: true,
    }),
    RoomsModule,
    BookingsModule,
  ],
})
export class AppModule {}