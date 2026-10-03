import React, { useState } from 'react';

export default function AddTaskForm({ onAdd, onClose }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('خبر');
  const [platform, setPlatform] = useState('فيسبوك');
  const [assignees, setAssignees] = useState('');

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert("يرجى كتابة عنوان المادة أولاً!");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: title,
      type: type,
      progress: 0,
      status: 'مخطط',
      platform: platform,
      assignees: assignees || 'غير محدد'
    };

    // إرسال المهمة للوحة الرئيسية وإغلاق النافذة فوراً
    onAdd(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" dir="rtl">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">إضافة مادة إعلامية جديدة</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">عنوان المادة (التغطية / الخبر)</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="مثال: تغطية زيارة وفد طبي..." 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">نوع المادة</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="خبر">خبر</option>
                <option value="تغطية">تغطية</option>
                <option value="فيديو">فيديو</option>
                <option value="تصميم">تصميم</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">منصة النشر</label>
              <select 
                value={platform} 
                onChange={(e) => setPlatform(e.target.value)} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="فيسبوك">فيسبوك</option>
                <option value="إنستغرام">إنستغرام</option>
                <option value="الموقع الإلكتروني">الموقع الإلكتروني</option>
                <option value="متعدد">متعدد</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">الموكل إليه (المحرر / المصور)</label>
            <input 
              type="text" 
              value={assignees} 
              onChange={(e) => setAssignees(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="مثال: محمد علي، طارق..." 
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold"
            >
              إلغاء
            </button>
            <button 
              type="button" 
              onClick={handleCustomSubmit}
              className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold shadow-md cursor-pointer"
            >
              إضافة وحفظ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}