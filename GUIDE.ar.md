# دليل إعداد مشروع المتجر الإلكتروني (E-Commerce Backend)

هذا الدليل يشرح لك الخطوات اللازمة لإعداد جميع الخدمات السحابية المطلوبة لتشغيل المشروع من الصفر.

---

## 1. إعداد قاعدة بيانات نيون (Neon PostgreSQL)

نيون هي قاعدة بيانات PostgreSQL سحابية وسهلة الاستخدام.

**الخطوات:**
1. اذهب إلى [neon.tech](https://neon.tech/) وأنشئ حساباً جديداً (يمكنك استخدام حساب GitHub).
2. بعد تسجيل الدخول، اضغط على **"Create a new project"**.
3. قم بتسمية المشروع (مثلاً: `ecommerce-backend`).
4. اختر منطقة قريبة منك (Region)، ثم اضغط **"Create Project"**.
5. سيظهر لك مباشرة **Connection String**. سيكون شكله هكذا:
   `postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`
6. قم بنسخ هذا الرابط بالكامل وضعه في ملف `.env` تحت اسم `DATABASE_URL`.

---

## 2. توليد مفتاح NextAuth السري (AUTH_SECRET)

تحتاج NextAuth إلى مفتاح تشفير لتأمين الـ JWT والجلسات.

**الخطوات:**
1. افتح التيرمينال (Terminal) في مجلد المشروع.
2. قم بتشغيل الأمر التالي:
   ```bash
   npx auth secret
   ```
3. سيتم إنشاء مفتاح عشوائي طويل. انسخه وضعه في ملف `.env` هكذا:
   `AUTH_SECRET="المفتاح_الذي_تم_توليده"`

---

## 3. إعداد خدمة الصور (Cloudinary)

سنستخدم Cloudinary لتخزين صور المنتجات.

**الخطوات:**
1. اذهب إلى [cloudinary.com](https://cloudinary.com/) وأنشئ حساباً مجانياً.
2. بعد الدخول إلى الـ **Dashboard**، ستجد معلومات الـ **Product Environment Credentials**:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. انسخ هذه القيم وضعها في ملف `.env` كالتالي:
   ```env
   CLOUDINARY_CLOUD_NAME="اسم_الـ_cloud"
   CLOUDINARY_API_KEY="رقم_الـ_key"
   CLOUDINARY_API_SECRET="رقم_الـ_secret"
   ```

---

## 4. إعداد تحديد معدل الطلبات (Upstash Redis)

هذا الجزء مهم لحماية الـ API من كثرة الطلبات (Rate Limiting).

**الخطوات:**
1. اذهب إلى [upstash.com](https://upstash.com/) وأنشئ حساباً.
2. اضغط على **"Create Database"**.
3. اختر نوع **Redis**.
4. بعد إنشاء القاعدة، ابحث عن قسم **"REST API"** وانسخ القيمتين التاليتين:
   - **UPSTASH_REDIS_REST_URL**
   - **UPSTASH_REDIS_REST_TOKEN**
5. ضعهما في ملف `.env`.

---

## ملخص ملف الـ `.env` النهائي

تأكد أن ملف `.env` يحتوي على القيم التالية قبل تشغيل المشروع:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."
```

---

## الخطوات القادمة
بمجرد إعداد هذه المتغيرات، سنقوم بتشغيل:
1. `npm install` لتثبيت المكتبات.
2. `npx prisma db push` لإنشاء الجداول في قاعدة بيانات نيون.
3. `npm run dev` لتشغيل المشروع.
