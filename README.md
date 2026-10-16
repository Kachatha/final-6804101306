# รายงานการทดสอบ Software Testing ด้วย Playwright

## คำอธิบาย Integration Testing (บทที่ 2)
* IT-01 (Top-Down with Stub): ส่วนที่เป็น "Real" คือการ Login ผ่านหน้าฟอร์มจริงของเว็บไซต์จนเข้าสู่ระบบสำเร็จ ส่วนที่เป็น "Stub" คือการใช้คำสั่ง `page.setContent()` เพื่อจำลองหน้า Inventory ขึ้นมาทับของเดิม (Mock) โดยไม่ต้องใช้ข้อมูลสินค้าจริงจากระบบ
* IT-02 (Bottom-Up with Driver): ส่วนที่เป็น "Driver" คือฟังก์ชันที่จำลองสถานะการ Login โดยการฝัง Cookie (`session-username`) ลงใน Browser Context เพื่อข้ามขั้นตอน Login ส่วนที่เป็น "Real" คือการทดสอบระบบ Inventory และ Shopping Cart ของจริงหลังจากที่มีสถานะ Login แล้ว