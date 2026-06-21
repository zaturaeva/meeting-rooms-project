import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking } from './bookings.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private roomsService: RoomsService,
  ) {}

  async findAll(): Promise<Booking[]> {
    return this.bookingsRepository.find({ order: { startTime: 'ASC' } });
  }

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { roomId, startTime, endTime } = createBookingDto;

    // Правило 1: время окончания больше времени начала
    if (new Date(startTime) >= new Date(endTime)) {
      throw new BadRequestException('endTime must be greater than startTime');
    }

    // Правило 2: комната существует
    const room = await this.roomsService.findOne(roomId);
    if (!room) {
      throw new BadRequestException(`Room with id ${roomId} does not exist`);
    }

    // Правило 3: нет пересекающихся бронирований
    const overlapping = await this.bookingsRepository.findOne({
      where: {
        roomId,
        startTime: Between(new Date(startTime), new Date(endTime)),
      },
    });

    if (overlapping) {
      throw new BadRequestException('Time slot overlaps with existing booking');
    }

    const booking = this.bookingsRepository.create({
      roomId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    });

    return this.bookingsRepository.save(booking);
  }

  async remove(id: number): Promise<void> {
    const result = await this.bookingsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
  }
}