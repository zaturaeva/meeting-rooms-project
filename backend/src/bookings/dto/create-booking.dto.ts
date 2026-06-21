import { IsNumber, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  @IsNotEmpty()
  roomId!: number; // ← Добавлен !

  @IsDateString()
  @IsNotEmpty()
  startTime!: string; // ← Добавлен !

  @IsDateString()
  @IsNotEmpty()
  endTime!: string; // ← Добавлен !
}