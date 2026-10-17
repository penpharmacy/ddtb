 E-Learning Pharmacy System (Google Apps Script + Google Sheets)

ระบบเรียนรู้ด้วยตนเองออนไลน์ (E-Learning) สำหรับความรู้เรื่องการใช้ยาอย่างปลอดภัย พัฒนาด้วย Google Apps Script (GAS) ร่วมกับฐานข้อมูล E-learningpharmacy - Google ชีต พร้อมระบบออกเกียรติบัตรอัตโนมัติ

🌐 ลิงก์เข้าใช้งานระบบและฐานข้อมูล

👉 คลิกที่นี่เพื่อเข้าสู่ระบบ E-Learning Pharmacy (Web App)

📊 ฐานข้อมูล: E-learningpharmacy - Google ชีต (เฉพาะผู้ดูแลระบบที่มีสิทธิ์เข้าถึง)

✨ ฟีเจอร์หลัก (Key Features)

Role-Based Access Control: รองรับผู้ใช้งาน 4 ระดับ ได้แก่ Guest, Student, Teacher, และ Admin

Course & Lesson Management: รองรับเนื้อหาทั้งแบบบทความ (HTML/Text), วิดีโอ (YouTube/Vimeo Embed), และใบงานดาวน์โหลด

Flexible Quiz System: รองรับข้อสอบปรนัย (2-8 ตัวเลือก), ถูก/ผิด, เติมคำตอบ, รูปภาพประกอบโจทย์/ตัวเลือก และการนำเข้าข้อสอบผ่านไฟล์ .csv

Custom Certificate Builder: ปรับแต่งพื้นหลัง ตำแหน่ง ฟอนต์ ขนาด และสีข้อความบนเกียรติบัตรได้แบบ Real-time พร้อมดาวน์โหลดเป็นไฟล์ PNG

Auto Database Setup: สร้างตารางและข้อมูลตั้งต้นใน Google Sheets (E-learningpharmacy) อัตโนมัติด้วยฟังก์ชัน SetupAllSheet()

🗄️ โครงสร้างฐานข้อมูล (E-learningpharmacy - Google ชีต)

เมื่อรันฟังก์ชัน SetupAllSheet() ระบบจะสร้างชีตย่อยทั้งหมด 10 ตาราง ดังนี้:

ชื่อชีต (Sheet Name)

คำอธิบาย

คอลัมน์หลัก (Headers)

Users

ข้อมูลสมาชิกและสิทธิ์การใช้งาน

userId, email, password, fullName, role, status, createdAt, lastLogin

Config

การตั้งค่าระบบและเลขรันนิ่งเกียรติบัตร

key, value

Courses

ข้อมูลหลักสูตรและแม่แบบเกียรติบัตรประจำวิชา

courseId, courseName, description, teacherId, teacherName, coverImage, status, passScore, createdAt, updatedAt, certTemplateSettings

Lessons

เนื้อหาบทเรียนในแต่ละหลักสูตร

lessonId, courseId, title, content, order, createdAt, type, isMandatory

Quizzes

คลังข้อสอบของแต่ละหลักสูตร

quizId, courseId, question, optionA, optionB, optionC, optionD, correctAnswer, score, questionType, questionImage, optionsJson

Enrollments

ประวัติการลงทะเบียนเรียนและผลการสอบ

enrollmentId, userId, courseId, progress, score, status, enrolledAt, completedAt, certificateNo

LessonProgress

ติดตามความคืบหน้าการเรียนรายบท

progressId, userId, courseId, lessonId, completedAt

Notifications

การแจ้งเตือนผู้ใช้งานในระบบ

notificationId, userId, message, link, isRead, createdAt

Certificates

ทะเบียนเกียรติบัตรที่ออกให้ผู้เรียน

certificateId, enrollmentId, userId, courseId, certificateNo, issuedAt, templateData

Logs

บันทึกประวัติการใช้งานระบบ (Audit Log)

logId, userId, action, detail, timestamp

📁 โครงสร้างไฟล์ใน Repository

├── Code.gs       # โค้ดฝั่ง Backend (Google Apps Script เชื่อมต่อ E-learningpharmacy)
├── Index.html    # โค้ดฝั่ง Frontend (HTML5 + Bootstrap 5 + JS)
└── README.md     # คู่มือการติดตั้งและโครงสร้างระบบ


🚀 วิธีการติดตั้ง (Installation Guide)

สร้างไฟล์ Google Sheets ใหม่และตั้งชื่อว่า E-learningpharmacy

คัดลอก Spreadsheet ID จาก URL ของ Google Sheets มาใส่ในตัวแปร SPREADSHEET_ID ในไฟล์ Code.gs (บรรทัดที่ 15)

ใน Google Sheets ไปที่เมนู ส่วนขยาย (Extensions) > Apps Script

สร้างไฟล์ตามโครงสร้าง:

วางโค้ดจาก Code.gs ลงในไฟล์ Code.gs

กดเครื่องหมาย + เลือก HTML ตั้งชื่อว่า Index (ไม่ต้องใส่นามสกุล .html) แล้ววางโค้ดจาก Index.html

กดปุ่ม บันทึก (Save) จากนั้นเลือกฟังก์ชัน SetupAllSheet ด้านบน แล้วกด เรียกใช้ (Run) เพื่อสร้างชีตและข้อมูลตัวอย่างทั้งหมดลงใน E-learningpharmacy - Google ชีต

กดปุ่ม ทำให้ใช้งานได้ (Deploy) > การทำให้ใช้งานได้รายการใหม่ (New deployment)

ประเภท: เว็บแอป (Web app)

ดำเนินการในฐานะ: ฉัน (Me)

ผู้ที่มีสิทธิ์เข้าถึง: ทุกคน (Anyone)

นำลิงก์ Web App URL ไปใช้งานได้ทันที!

🔑 บัญชีทดสอบเริ่มต้น (Default Accounts)

สิทธิ์การใช้งาน

อีเมล

รหัสผ่าน

Admin

admin@elearn.com

123456

Teacher

teacher@elearn.com

123456

Student

student@elearn.com

123456
