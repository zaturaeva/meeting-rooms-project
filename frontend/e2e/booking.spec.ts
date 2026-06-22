
import { test, expect } from '@playwright/test';

test.describe('Booking System E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Переход на главную страницу перед каждым тестом
    await page.goto('http://localhost:5173');
  });

  test('should display rooms list', async ({ page }) => {
    // Проверка, что список комнат отображается
    await expect(page.locator('.rooms-list')).toBeVisible();
    await expect(page.locator('.room-card')).toHaveCount(3);
  });

  test('should create a new booking', async ({ page }) => {
    // Выбор комнаты
    await page.selectOption('select', { label: 'Conference Room A' });
    
    // Заполнение даты и времени
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().slice(0, 16);
    
    await page.fill('input[type="datetime-local"]:first-child', dateStr);
    await page.fill('input[type="datetime-local"]:last-child', dateStr.replace('10:00', '11:00'));
    
    // Отправка формы
    await page.click('button[type="submit"]');
    
    // Проверка успешного создания (зелёный тост)
    await expect(page.locator('.toast.success')).toBeVisible();
    await expect(page.locator('.toast.success')).toContainText('Booking created successfully');
  });

  test('should show error for overlapping booking', async ({ page }) => {
    // Создание первого бронирования
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().slice(0, 16);
    
    await page.selectOption('select', { label: 'Conference Room A' });
    await page.fill('input[type="datetime-local"]:first-child', dateStr);
    await page.fill('input[type="datetime-local"]:last-child', dateStr.replace('10:00', '11:00'));
    await page.click('button[type="submit"]');
    
    // Ожидание создания
    await expect(page.locator('.toast.success')).toBeVisible();
    
    // Создание второго бронирования (пересекающегося)
    await page.selectOption('select', { label: 'Conference Room A' });
    await page.fill('input[type="datetime-local"]:first-child', dateStr);
    await page.fill('input[type="datetime-local"]:last-child', dateStr.replace('10:00', '11:30'));
    await page.click('button[type="submit"]');
    
    // Проверка ошибки
    await expect(page.locator('.toast.error')).toBeVisible();
    await expect(page.locator('.toast.error')).toContainText('overlaps');
  });

  test('should delete a booking', async ({ page }) => {
    // Создание бронирования
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().slice(0, 16);
    
    await page.selectOption('select', { label: 'Conference Room A' });
    await page.fill('input[type="datetime-local"]:first-child', dateStr);
    await page.fill('input[type="datetime-local"]:last-child', dateStr.replace('10:00', '11:00'));
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.toast.success')).toBeVisible();
    
    // Удаление бронирования
    await page.click('button.delete-btn:first-child');
    
    // Подтверждение удаления
    page.on('dialog', async dialog => {
      await dialog.accept();
    });
    
    // Проверка удаления
    await expect(page.locator('.toast.success')).toBeVisible();
    await expect(page.locator('.toast.success')).toContainText('Booking deleted successfully');
  });

  test('should show validation error for empty form', async ({ page }) => {
    // Отправка пустой формы
    await page.click('button[type="submit"]');
    
    // Проверка ошибки валидации
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('Please select a room');
  });

  test('should show validation error for past date', async ({ page }) => {
    // Выбор комнаты
    await page.selectOption('select', { label: 'Conference Room A' });
    
    // Выбор даты в прошлом
    const past = new Date();
    past.setDate(past.getDate() - 1);
    const dateStr = past.toISOString().slice(0, 16);
    
    await page.fill('input[type="datetime-local"]:first-child', dateStr);
    await page.fill('input[type="datetime-local"]:last-child', dateStr.replace('10:00', '11:00'));
    await page.click('button[type="submit"]');
    
    // Проверка ошибки
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('Cannot book in the past');
  });
});