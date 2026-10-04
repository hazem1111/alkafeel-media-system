const fs = require('fs');
const path = require('path');

// قائمة بالمجلدات والملفات المراد تنظيفها
const itemsToDelete = [
  'android',       // مجلد مشروع أندرويد
  'ios',           // مجلد مشروع آيفون
  '.DS_Store',     // ملفات ماك المخفية
  'Thumbs.db',     // ملفات ويندوز المصغرة
  '.nomedia'       // ملفات أندرويد المخفية
];

console.log('جاري تنظيف ملفات الهاتف من المشروع...');

itemsToDelete.forEach(item => {
  const targetPath = path.join(__dirname, item);
  
  if (fs.existsSync(targetPath)) {
    try {
      // حذف المجلدات والملفات بشكل نهائي
      fs.rmSync(targetPath, { recursive: true, force: true });
      console.log(`✅ تم حذف: ${item}`);
    } catch (err) {
      console.error(`❌ خطأ أثناء حذف ${item}:`, err.message);
    }
  }
});

console.log('✨ تم تنظيف المجلد بنجاح!');