// backend/test/bookings.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest'; 
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { Room } from '../src/rooms/room.entity';
import { Booking } from '../src/bookings/bookings.entity';

describe('Bookings E2E', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    
    await app.init();
    dataSource = app.get(DataSource);
    
    // Очистка и заполнение тестовыми данными
    await dataSource.getRepository(Booking).clear();
    await dataSource.getRepository(Room).clear();
    
    await dataSource.getRepository(Room).save([
      { name: 'Conference Room A', capacity: 10 },
      { name: 'Meeting Room B', capacity: 4 },
      { name: 'Small Booth C', capacity: 2 },
    ]);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /rooms', () => {
    it('should return list of rooms', async () => {
      const response = await request(app.getHttpServer())
        .get('/rooms')
        .expect(200);
      
      expect(response.body).toHaveLength(3);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('capacity');
    });
  });

  describe('GET /bookings', () => {
    it('should return empty list initially', async () => {
      const response = await request(app.getHttpServer())
        .get('/bookings')
        .expect(200);
      
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /bookings', () => {
    const validBooking = {
      roomId: 1,
      startTime: new Date(Date.now() + 86400000).toISOString(),
      endTime: new Date(Date.now() + 86400000 + 3600000).toISOString(),
    };

    it('should create a valid booking', async () => {
      const response = await request(app.getHttpServer())
        .post('/bookings')
        .send(validBooking)
        .expect(201);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body.roomId).toBe(validBooking.roomId);
    });

    it('should reject booking with endTime <= startTime (400)', async () => {
      const invalidBooking = {
        roomId: 1,
        startTime: '2025-12-20T11:00:00Z',
        endTime: '2025-12-20T10:00:00Z',
      };
      
      await request(app.getHttpServer())
        .post('/bookings')
        .send(invalidBooking)
        .expect(400);
    });

    it('should reject booking for non-existent room (400)', async () => {
      const invalidBooking = {
        roomId: 999,
        startTime: validBooking.startTime,
        endTime: validBooking.endTime,
      };
      
      await request(app.getHttpServer())
        .post('/bookings')
        .send(invalidBooking)
        .expect(400);
    });

    it('should reject overlapping booking (400)', async () => {
      // Создаём первое бронирование
      await request(app.getHttpServer())
        .post('/bookings')
        .send(validBooking)
        .expect(201);
      
      // Пытаемся создать пересекающееся бронирование
      const overlappingBooking = {
        roomId: 1,
        startTime: validBooking.startTime,
        endTime: new Date(Date.now() + 86400000 + 7200000).toISOString(),
      };
      
      await request(app.getHttpServer())
        .post('/bookings')
        .send(overlappingBooking)
        .expect(400);
    });
  });

  describe('DELETE /bookings/:id', () => {
    it('should delete existing booking (204)', async () => {
      // Создаём бронирование
      const booking = {
        roomId: 1,
        startTime: new Date(Date.now() + 172800000).toISOString(),
        endTime: new Date(Date.now() + 172800000 + 3600000).toISOString(),
      };
      
      const response = await request(app.getHttpServer())
        .post('/bookings')
        .send(booking)
        .expect(201);
      
      const bookingId = response.body.id;
      
      // Удаляем
      await request(app.getHttpServer())
        .delete(`/bookings/${bookingId}`)
        .expect(204);
      
      // Проверяем, что удалилось
      const bookings = await request(app.getHttpServer())
        .get('/bookings')
        .expect(200);
      
      expect(bookings.body.find((b: any) => b.id === bookingId)).toBeUndefined();
    });

    it('should return 404 for non-existent booking', async () => {
      await request(app.getHttpServer())
        .delete('/bookings/99999')
        .expect(404);
    });
  });
});