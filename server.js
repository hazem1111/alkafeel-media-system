const express = require('express');
const path = require('path');
const app = express();

// استخدام البورت المعرف في بيئة العمل أو بورت افتراضي 10000
const PORT = process.env.PORT || 10000;

// تفعيل خدمة الملفات الثابتة من مجلد البناء (dist)
app.use(express.static(path.join(__dirname, 'dist')));

// توجيه كافة المسارات والطلبات إلى ملف index.html لضمان عمل راوتر التطبيق بسلاسة
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});