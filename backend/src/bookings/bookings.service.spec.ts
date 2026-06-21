import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from './bookings.entity';
import { RoomsService } from '../rooms/rooms.service';

// Моки
const mockBookingsRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
};

const mockRoomsService = {
  findOne: jest.fn(),
};

describe('BookingsService', () => {
  let service: BookingsService;
  let roomsService: RoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: getRepositoryToken(Booking), useValue: mockBookingsRepository },
        { provide: RoomsService, useValue: mockRoomsService },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    roomsService = module.get<RoomsService>(RoomsService);
  });

  it('should throw if endTime <= startTime', async () => {
    const dto = {
      roomId: 1,
      startTime: '2025-01-20T11:00:00Z',
      endTime: '2025-01-20T10:00:00Z',
    };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw if room does not exist', async () => {
    jest.spyOn(roomsService, 'findOne').mockResolvedValue(null);
    const dto = {
      roomId: 999,
      startTime: '2025-01-20T10:00:00Z',
      endTime: '2025-01-20T11:00:00Z',
    };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw if overlapping booking exists', async () => {
    jest.spyOn(roomsService, 'findOne').mockResolvedValue({
      id: 1,
      name: 'Meeting Room',
      capacity: 10,
      bookings: [],
    });
    
    mockBookingsRepository.findOne.mockResolvedValue({ id: 2 });
    
    const dto = {
      roomId: 1,
      startTime: '2025-01-20T10:00:00Z',
      endTime: '2025-01-20T11:00:00Z',
    };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });
}); 