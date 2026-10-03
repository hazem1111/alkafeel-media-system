import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// مسار ملف الحفظ الدائم على السيرفر
const DB_FILE = path.join(__dirname, 'db.json');

// دالة قراءة البيانات
const readDb = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("خطأ في قراءة قاعدة البيانات:", err);
  }
  return { tasks: [], socialLogs: {}, employeeAccounts: {} };
};

// دالة كتابة وحفظ البيانات بشكل دائم
const writeDb = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error("خطأ في حفظ قاعدة البيانات:", err);
  }
};

// API لجلب البيانات
app.get('/api/data', (req, res) => {
  const dbData = readDb();
  res.json(dbData);
});

// API لحفظ وتحديث البيانات فوراً
app.post('/api/data', (req, res) => {
  const { tasks, socialLogs, employeeAccounts } = req.body;
  const currentDb = readDb();

  const updatedData = {
    tasks: tasks !== undefined ? tasks : currentDb.tasks,
    socialLogs: socialLogs !== undefined ? socialLogs : currentDb.socialLogs,
    employeeAccounts: employeeAccounts !== undefined ? employeeAccounts : currentDb.employeeAccounts
  };

  writeDb(updatedData);
  res.json({ success: true, message: "تم الحفظ سحابياً بنجاح" });
});

// تقديم الملفات المبنية من مجلد dist
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} with Persistent Storage enabled!`);
});