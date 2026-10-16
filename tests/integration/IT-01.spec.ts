import { test, expect } from '@playwright/test';

test('IT-01: top-down REAL Login -> browser-level Inventory STUB', {
  annotation: {
    type: 'description',
    description: 'ทดสอบ Login จริงร่วมกับ Inventory Stub ที่จำลองด้วย page.setContent()'
  }
}, async ({ page }) => {
  await test.step('Login ผ่านหน้าเว็บไซต์จริง', async () => {
    // Login และตรวจสอบ URL inventory.html
    await page.goto('/');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  await test.step('สร้าง Inventory Stub', async () => {
    // ใช้ page.setContent() แสดง Mock Inventory Ready และสินค้าจำลอง 2 รายการ
    const stubHtml = `
      <div id="mock-container">
        <h1 id="mock-title">Mock Inventory Ready</h1>
        <div class="mock-item">Mock Backpack</div>
        <div class="mock-item">Mock Bike Light</div>
      </div>
    `;
    await page.setContent(stubHtml);
  });

  await test.step('ตรวจสอบผลจาก Stub', async () => {
    // ตรวจสอบข้อความ จำนวน และชื่อสินค้าจำลอง
    await expect(page.locator('#mock-title')).toHaveText('Mock Inventory Ready');
    
    // ตรวจสอบจำนวนสินค้าจำลองว่ามี 2 รายการ
    const mockItems = page.locator('.mock-item');
    await expect(mockItems).toHaveCount(2);
    
    // ตรวจสอบชื่อสินค้าจำลอง
    await expect(mockItems.nth(0)).toHaveText('Mock Backpack');
    await expect(mockItems.nth(1)).toHaveText('Mock Bike Light');
  });
});