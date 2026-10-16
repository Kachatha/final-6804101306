import { test, expect } from '@playwright/test';

test.describe('UT-01: Login Form Validation', () => {
  test('UT-01.1: empty username and password', {
    annotation: { type: 'description', description: 'ตรวจสอบการ Login เมื่อไม่กรอก Username และ Password' }
  }, async ({ page }) => {
    await test.step('เปิดหน้า Login', async () => {
      // เปิดเว็บไซต์ SauceDemo (ใช้ '/' ได้เลยเพราะตั้ง baseURL ไว้แล้ว)
      await page.goto('/');
    });
    await test.step('ส่งฟอร์มโดยไม่กรอกข้อมูล', async () => {
      // กดปุ่ม Login
      await page.locator('#login-button').click();
    });
    await test.step('ตรวจสอบ Error และ URL', async () => {
      // ตรวจสอบ Username is required และไม่เข้าสู่ Inventory
      await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
      expect(page.url()).not.toContain('inventory.html');
    });
  });

  test('UT-01.2: missing password', {
    annotation: { type: 'description', description: 'ตรวจสอบการ Login เมื่อกรอก Username แต่ไม่กรอก Password' }
  }, async ({ page }) => {
    await test.step('เปิดหน้า Login และกรอก Username', async () => {
      // กรอก standard_user
      await page.goto('/');
      await page.locator('#user-name').fill('standard_user');
    });
    await test.step('กด Login โดยไม่กรอก Password', async () => {
      // ส่งฟอร์ม
      await page.locator('#login-button').click();
    });
    await test.step('ตรวจสอบ Error และ URL', async () => {
      // ตรวจสอบ Password is required และไม่เข้าสู่ Inventory
      await expect(page.locator('[data-test="error"]')).toContainText('Password is required');
      expect(page.url()).not.toContain('inventory.html');
    });
  });

  test('UT-01.3: invalid login details', {
    annotation: { type: 'description', description: 'ตรวจสอบการ Login เมื่อ Username และ Password ไม่ถูกต้อง' }
  }, async ({ page }) => {
    await test.step('เปิดหน้า Login และกรอกข้อมูลผิด', async () => {
      // กรอก invalid_user / wrong_password
      await page.goto('/');
      await page.locator('#user-name').fill('invalid_user');
      await page.locator('#password').fill('wrong_password');
    });
    await test.step('กด Login', async () => {
      // ส่งฟอร์ม
      await page.locator('#login-button').click();
    });
    await test.step('ตรวจสอบ Error และ URL', async () => {
      // ตรวจสอบข้อความแจ้งข้อมูลไม่ถูกต้อง และไม่เข้าสู่ Inventory
      await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
      expect(page.url()).not.toContain('inventory.html');
    });
  });
});