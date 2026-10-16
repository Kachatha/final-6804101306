import { test, expect, BrowserContext, Page } from '@playwright/test';

// สร้างฟังก์ชัน driverOpenInventory() ทำหน้าที่ Driver เตรียมสถานะ Login
async function driverOpenInventory(context: BrowserContext) {
  await context.addCookies([
    {
      name: 'session-username',
      value: 'standard_user',
      domain: 'www.saucedemo.com',
      path: '/'
    }
  ]);
}

test('IT-02: DRIVER login state -> REAL Inventory and Cart', {
  annotation: {
    type: 'description',
    description: 'ใช้ Driver เตรียมสถานะ Login เพื่อทดสอบ Inventory และ Cart จริง'
  }
}, async ({ browser }) => {
  // ใส่ ! เพื่อบอก TypeScript ว่าตัวแปรเหล่านี้จะถูกกำหนดค่าแน่นอน
  let context!: BrowserContext;
  let page!: Page;

  await test.step('สร้าง Driver และเปิด Inventory', async () => {
    // สร้าง BrowserContext และใช้ driverOpenInventory() ตั้งค่า Cookie
    context = await browser.newContext({ baseURL: 'https://www.saucedemo.com' });
    await driverOpenInventory(context);
    page = await context.newPage();
    
    // เปิดหน้า inventory.html โดยตรง ไม่ผ่าน Login Form
    await page.goto('/inventory.html');
  });

  await test.step('ตรวจสอบ Inventory จริง', async () => {
    // ตรวจสอบสินค้า 6 รายการ
    const inventoryItems = page.locator('.inventory_item');
    await expect(inventoryItems).toHaveCount(6);
  });

  await test.step('เพิ่มสินค้า 2 รายการ', async () => {
    // เพิ่ม Backpack และ Bike Light แล้วตรวจสอบ Cart Badge = 2
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('2');
  });

  await test.step('ตรวจสอบสินค้าใน Cart', async () => {
    // เปิด Cart และตรวจสอบชื่อสินค้าทั้งสองรายการ
    await page.locator('.shopping_cart_link').click();
    
    await expect(page.locator('.inventory_item_name').filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
    await expect(page.locator('.inventory_item_name').filter({ hasText: 'Sauce Labs Bike Light' })).toBeVisible();
  });

  // ปิด BrowserContext ที่สร้างเองเมื่อสิ้นสุดการทดสอบ
  await context.close();
});