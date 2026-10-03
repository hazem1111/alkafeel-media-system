import React, { useState, useEffect } from 'react';

export default function MediaDashboard() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('alkafeel_media_current_user_v39');
      if (savedUser) return JSON.parse(savedUser);
    } catch(e) { console.error(e); }
    return null;
  });

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [tasks, setTasks] = useState([]);
  const [socialLogs, setSocialLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [syncStatus, setSyncStatus] = useState('متصل ✅'); // مؤشر المزامنة السحابية

  const [employeeAccounts, setEmployeeAccounts] = useState({
    'حازم': { name: 'المهندس حازم فاضل الأسدي', role: 'admin', pass: 'JUVEjuve12' },
    'طارق': { name: 'طارق جعفر حسين', role: 'editor', pass: 'tariq123' },
    'رشا': { name: 'رشا ناجح', role: 'editor', pass: 'rasha123' },
    'حيدر': { name: 'حيدر ضياء جابر', role: 'cameraman', pass: 'haidar123' },
    'ياسر': { name: 'ياسر محمد مهدي', role: 'cameraman', pass: 'yasser123' },
    'محمد': { name: 'محمد علي عطية', role: 'montage', pass: 'mohammad123' },
    'زهراء': { name: 'زهراء صلاح', role: 'checker', pass: 'zahra123' },
    'علي': { name: 'علي صالح مشحوف', role: 'designer', pass: 'ali123' },
    'ناشر': { name: 'فريق النشر', role: 'publisher', pass: 'pub123' },
    'فرقان': { name: 'فرقان عبد الرضا', role: 'social', pass: 'forqan123' }, 
    'taher': { name: 'طاهر حسين', role: 'hr', pass: 'taher123' }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('الرئيسية');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewingTask, setViewingTask] = useState(null);

  const [videoCheckerSelections, setVideoCheckerSelections] = useState({});
  const [finalCheckerSelections, setFinalCheckerSelections] = useState({});

  // حقول الإضافة المباشرة من قسم النشر
  const [directPubTitle, setDirectPubTitle] = useState('');
  const [directPubType, setDirectPubType] = useState('أخبار');
  const [directPubDate, setDirectPubDate] = useState(new Date().toISOString().split('T')[0]);
  const [directPubLink, setDirectPubLink] = useState('');
  const [directPubPlatforms, setDirectPubPlatforms] = useState({
    facebook: true,
    instagram: false,
    telegram: false,
    youtube: false,
    tiktok: false,
    x: false,
    website: false
  });
  const [directPubNotes, setDirectPubNotes] = useState('');

  // حقول المصور والمحرر والمصمم والمونتير
  const [newTitle, setNewTitle] = useState('');
  const [newContentType, setNewContentType] = useState('خبر');
  const [newShootType, setNewShootType] = useState('فيديو');
  const [newCameramanName, setNewCameramanName] = useState('حيدر ضياء جابر');
  const [newAddDate, setNewAddDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNotes, setNewNotes] = useState('');

  const [editorTitle, setEditorTitle] = useState('');
  const [editorContentType, setEditorContentType] = useState('خبر');
  const [editorTarget, setEditorTarget] = useState('4. التصميم');
  const [editorAddDate, setEditorAddDate] = useState(new Date().toISOString().split('T')[0]);
  const [editorNotes, setEditorNotes] = useState('');

  const [designerTitle, setDesignerTitle] = useState('');
  const [designerContentType, setDesignerContentType] = useState('إعلام طبي');
  const [designerAddDate, setDesignerAddDate] = useState(new Date().toISOString().split('T')[0]);
  const [designerNotes, setDesignerNotes] = useState('');

  const [montageTitle, setMontageTitle] = useState('');
  const [montageContentType, setMontageContentType] = useState('فيديو');
  const [montageAddDate, setMontageAddDate] = useState(new Date().toISOString().split('T')[0]);
  const [montageNotes, setMontageNotes] = useState('');

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberUsername, setNewMemberUsername] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('editor');
  const [newMemberPass, setNewMemberPass] = useState('');
  const [editingMemberKey, setEditingMemberKey] = useState(null);

  const [socialDate, setSocialDate] = useState(new Date().toISOString().split('T')[0]);
  const [socialMessages, setSocialMessages] = useState('');
  const [socialComments, setSocialComments] = useState('');

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        if (data && data.tasks && Array.isArray(data.tasks)) setTasks(data.tasks);
        else setTasks([
          { 
            id: 1, 
            title: 'تغطية عملية زراعة الكلى المعقدة', 
            contentType: 'العمليات الجراحية', 
            shootType: 'فيديو', 
            addDate: '2026-10-01',
            cameraman: 'حيدر ضياء جابر',
            stage: 'منجز ومؤرشف', 
            progress: 100,
            hasError: false,
            notes: 'عمل ممتاز'
          }
        ]);

        if (data && data.socialLogs && Array.isArray(data.socialLogs)) setSocialLogs(data.socialLogs);
        if (data && data.employeeAccounts && typeof data.employeeAccounts === 'object') {
          const cleanedAccounts = { ...data.employeeAccounts };
          delete cleanedAccounts['hazem'];
          setEmployeeAccounts(prev => ({ ...prev, ...cleanedAccounts }));
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("فشل الاتصال بالسيرفر:", err);
        setSyncStatus('وضع عدم الاتصال (محلي) ⚠️');
        setIsLoading(false);
      });
  }, []);

  const syncWithServer = (updatedTasks, updatedSocial, updatedAccounts) => {
    setSyncStatus('جاري الحفظ سحابياً... 🔄');
    const payload = {
      tasks: updatedTasks !== undefined ? updatedTasks : tasks,
      socialLogs: updatedSocial !== undefined ? updatedSocial : socialLogs,
      employeeAccounts: updatedAccounts !== undefined ? updatedAccounts : employeeAccounts
    };

    fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(() => setSyncStatus('متصل وحفظ بنجاح ✅'))
    .catch(err => {
      console.error("خطأ في الحفظ السحابي:", err);
      setSyncStatus('خطأ في الاتصال ❌');
    });
  };

  const addNotification = (msg) => {
    const newNotif = { id: Date.now(), text: msg, time: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }) };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const cleanUser = loginUsername.trim().toLowerCase();
    const account = employeeAccounts[cleanUser] || (cleanUser === 'hazem' ? employeeAccounts['حازم'] : null);
    if (account && account.pass === loginPassword) {
      const userData = { username: cleanUser, ...account };
      setCurrentUser(userData);
      if (rememberMe) {
        localStorage.setItem('alkafeel_media_current_user_v39', JSON.stringify(userData));
      }
      setActiveTab('الرئيسية');
      addNotification(`تم تسجيل الدخول بنجاح بواسطة ${userData.name}`);
    } else {
      alert("اسم المستخدم أو كلمة المرور غير صحيحة!");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('alkafeel_media_current_user_v39');
    setLoginUsername('');
    setLoginPassword('');
  };

  const canEditSection = (sectionRole) => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    return currentUser.role === sectionRole;
  };

  const canEditReports = () => {
    if (!currentUser) return false;
    return currentUser.role === 'admin';
  };

  const handleCameramanSubmit = (e) => {
    e.preventDefault();
    if (!canEditSection('cameraman')) { alert("هذا القسم مخصص للمصورين فقط!"); return; }
    if (!newTitle.trim()) { alert("يرجى إدخال عنوان المادة!"); return; }

    const todayStr = newAddDate || new Date().toISOString().split('T')[0];
    const newTask = {
      id: Date.now(),
      title: newTitle,
      contentType: newContentType,
      shootType: newShootType,
      addDate: todayStr,
      cameraman: newCameramanName,
      cameramanDate: todayStr,
      stage: '1.5. التدقيق الفيديوي',
      progress: 20,
      hasError: false,
      notes: newNotes,
      publishPlatforms: { facebook: true },
      publishState: 'لم ينشر'
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    syncWithServer(updatedTasks, undefined, undefined);
    addNotification(`تم إضافة مادة تصوير جديدة: ${newTitle}`);
    setNewTitle(''); setNewNotes('');
    setActiveTab('1.5. التدقيق الفيديوي');
    alert("تم إضافة المادة وإرسالها للتدقيق الفيديوي بنجاح.");
  };

  const handleEditorSubmit = (e) => {
    e.preventDefault();
    if (!canEditSection('editor')) { alert("هذا القسم مخصص للمحررين فقط!"); return; }
    if (!editorTitle.trim()) { alert("يرجى إدخال عنوان المادة!"); return; }

    const todayStr = editorAddDate || new Date().toISOString().split('T')[0];
    const newTask = {
      id: Date.now(),
      title: editorTitle,
      contentType: editorContentType,
      shootType: 'محتوى تحريري',
      addDate: todayStr,
      editorName: currentUser.name,
      editorDate: todayStr,
      stage: editorTarget,
      progress: 50,
      hasError: false,
      notes: editorNotes,
      publishPlatforms: { facebook: true },
      publishState: 'لم ينشر'
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    syncWithServer(updatedTasks, undefined, undefined);
    addNotification(`مادة تحريرية جديدة متوجهة إلى ${editorTarget}: ${editorTitle}`);
    setEditorTitle(''); setEditorNotes('');
    setActiveTab(editorTarget);
    alert(`تم إضافة المادة وتوجيهها إلى (${editorTarget}) بنجاح.`);
  };

  const handleDesignerSubmit = (e) => {
    e.preventDefault();
    if (!canEditSection('designer')) { alert("هذا القسم مخصص للمصممين فقط!"); return; }
    if (!designerTitle.trim()) { alert("يرجى إدخال عنوان التصميم!"); return; }

    const todayStr = designerAddDate || new Date().toISOString().split('T')[0];
    const newTask = {
      id: Date.now(),
      title: designerTitle,
      contentType: designerContentType,
      shootType: 'تصميم',
      addDate: todayStr,
      designerName: currentUser.name,
      designerDate: todayStr,
      stage: '6. التدقيق النهائي',
      progress: 75,
      hasError: false,
      notes: designerNotes,
      publishPlatforms: { facebook: true },
      publishState: 'لم ينشر'
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    syncWithServer(updatedTasks, undefined, undefined);
    addNotification(`تصميم جديد أُرسل للتدقيق النهائي: ${designerTitle}`);
    setDesignerTitle(''); setDesignerNotes('');
    setActiveTab('6. التدقيق النهائي');
    alert("تم إضافة التصميم وتوجيهه للتدقيق النهائي بنجاح.");
  };

  const handleMontageSubmit = (e) => {
    e.preventDefault();
    if (!canEditSection('montage')) { alert("هذا القسم مخصص للمونتير فقط!"); return; }
    if (!montageTitle.trim()) { alert("يرجى إدخال عنوان الفيديو!"); return; }

    const todayStr = montageAddDate || new Date().toISOString().split('T')[0];
    const newTask = {
      id: Date.now(),
      title: montageTitle,
      contentType: montageContentType,
      shootType: 'مونتاج',
      addDate: todayStr,
      montageName: currentUser.name,
      montageDate: todayStr,
      stage: '6. التدقيق النهائي',
      progress: 75,
      hasError: false,
      notes: montageNotes,
      publishPlatforms: { facebook: true },
      publishState: 'لم ينشر'
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    syncWithServer(updatedTasks, undefined, undefined);
    addNotification(`فيديو جديد أُنجز بالمونتاج: ${montageTitle}`);
    setMontageTitle(''); setMontageNotes('');
    setActiveTab('6. التدقيق النهائي');
    alert("تم إضافة المونتاج وتوجيهه للتدقيق النهائي بنجاح.");
  };

  const handleDirectPublishSubmit = (e) => {
    e.preventDefault();
    if (!canEditSection('publisher')) { alert("هذا القسم مخصص لفريق النشر فقط!"); return; }
    if (!directPubTitle.trim()) { alert("يرجى إدخال اسم المادة!"); return; }

    const newTask = {
      id: Date.now(),
      title: directPubTitle,
      contentType: directPubType,
      shootType: 'إعادة نشر مادة جاهزة',
      addDate: directPubDate,
      publisherName: currentUser.name,
      publisherDate: directPubDate,
      publishPlatforms: directPubPlatforms,
      publishState: 'نشر',
      publishLink: directPubLink,
      stage: 'منجز ومؤرشف',
      progress: 100,
      hasError: false,
      notes: directPubNotes || 'مادة معاد نشرها مباشرة'
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    syncWithServer(updatedTasks, undefined, undefined);
    addNotification(`تم نشر مادة مباشرة وأرشفتها: ${directPubTitle}`);
    setDirectPubTitle(''); setDirectPubLink(''); setDirectPubNotes('');
    alert("تم تسجيل ونشر المادة الجاهزة وإضافتها للتقرير الشهري والإحصائيات بنجاح.");
  };

  const handleStageAction = (id, currentStage, actionType) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const updatedTasks = tasks.map(t => {
      if (t.id === id) {
        let nextStage = currentStage;
        let prog = t.progress;
        let hasErr = t.hasError;
        let updatedFields = {};

        if (currentStage === '1. التصوير') {
          if (actionType === 'advance') { nextStage = '1.5. التدقيق الفيديوي'; prog = 20; hasErr = false; }
        }
        else if (currentStage === '1.5. التدقيق الفيديوي') {
          if (actionType === 'return') { nextStage = '1. التصوير'; prog = 10; hasErr = true; } 
          else if (actionType === 'advance') { 
            nextStage = '3. التحرير'; 
            prog = 35; 
            hasErr = false; 
            updatedFields.videoChecker = videoCheckerSelections[id] || 'طارق جعفر حسين';
            updatedFields.videoCheckerDate = todayStr; 
          }
        }
        else if (currentStage === '3. التحرير') {
          if (actionType === 'return') { nextStage = '1.5. التدقيق الفيديوي'; prog = 20; hasErr = true; } 
          else if (actionType === 'advance') { 
            nextStage = '5. المونتاج'; 
            prog = 55; 
            hasErr = false;
            updatedFields.editorName = updatedFields.editorName || currentUser.name;
            updatedFields.editorDate = todayStr;
          }
        } 
        else if (currentStage === '4. التصميم') {
          if (actionType === 'return') { nextStage = '3. التحرير'; prog = 35; hasErr = true; } 
          else if (actionType === 'advance') { 
            nextStage = '6. التدقيق النهائي'; 
            prog = 75; 
            hasErr = false; 
            updatedFields.designerName = updatedFields.designerName || currentUser.name;
            updatedFields.designerDate = todayStr; 
          }
        }
        else if (currentStage === '5. المونتاج') {
          if (actionType === 'return') { nextStage = '3. التحرير'; prog = 35; hasErr = true; } 
          else if (actionType === 'advance') { 
            nextStage = '6. التدقيق النهائي'; 
            prog = 75; 
            hasErr = false; 
            updatedFields.montageName = updatedFields.montageName || currentUser.name;
            updatedFields.montageDate = todayStr; 
          }
        } 
        else if (currentStage === '6. التدقيق النهائي') {
          if (actionType === 'return') { 
            nextStage = t.shootType === 'تصميم' ? '4. التصميم' : '5. المونتاج'; 
            prog = 55; 
            hasErr = true; 
          } 
          else if (actionType === 'advance') { 
            nextStage = '7. النشر'; 
            prog = 90; 
            hasErr = false; 
            updatedFields.checkerName = finalCheckerSelections[id] || 'زهراء صلاح';
            updatedFields.checkerDate = todayStr; 
          }
        } 
        else if (currentStage === '7. النشر') {
          if (actionType === 'return') { nextStage = '6. التدقيق النهائي'; prog = 75; hasErr = true; }
          else if (actionType === 'advance') { 
            nextStage = 'منجز ومؤرشف'; 
            prog = 100; 
            hasErr = false; 
            updatedFields.publisherDate = todayStr; 
            updatedFields.publisherName = currentUser.name; 
          }
        }

        return { ...t, ...updatedFields, stage: nextStage, progress: prog, hasError: hasErr };
      }
      return t;
    });

    setTasks(updatedTasks);
    syncWithServer(updatedTasks, undefined, undefined);
    addNotification(`تم تحديث مرحلة المادة ونقلها بنجاح`);
  };

  const handleEditTaskNotes = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newNotesVal = prompt("تعديل ملاحظات المادة:", task.notes || '');
    if (newNotesVal !== null) {
      const updatedTasks = tasks.map(t => t.id === id ? { ...t, notes: newNotesVal } : t);
      setTasks(updatedTasks);
      syncWithServer(updatedTasks, undefined, undefined);
    }
  };

  const handleEditTaskTitle = (id) => {
    if (currentUser.role !== 'admin') { alert("تعديل المواد مخصص لمسؤول الشعبة فقط."); return; }
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newTitleVal = prompt("تعديل عنوان المادة:", task.title);
    if (newTitleVal && newTitleVal.trim()) {
      const updatedTasks = tasks.map(t => t.id === id ? { ...t, title: newTitleVal.trim() } : t);
      setTasks(updatedTasks);
      syncWithServer(updatedTasks, undefined, undefined);
    }
  };

  const handleDeleteTask = (id) => {
    if (currentUser.role !== 'admin') { alert("حذف المواد مخصص لمسؤول الشعبة فقط."); return; }
    if (confirm("هل أنت متأكد من حذف هذه المادة؟")) {
      const updatedTasks = tasks.filter(t => t.id !== id);
      setTasks(updatedTasks);
      syncWithServer(updatedTasks, undefined, undefined);
    }
  };

  const handleSocialSubmit = (e) => {
    e.preventDefault();
    if (!canEditSection('social')) { alert("هذا القسم مخصص لفريق التواصل الاجتماعي فقط!"); return; }
    if (!socialMessages && !socialComments) { alert("يرجى إدخال البيانات!"); return; }

    const newLog = {
      id: Date.now(),
      date: socialDate,
      responder: currentUser.name,
      messagesCount: Number(socialMessages) || 0,
      commentsCount: Number(socialComments) || 0
    };

    const updatedLogs = [newLog, ...socialLogs];
    setSocialLogs(updatedLogs);
    syncWithServer(undefined, updatedLogs, undefined);
    addNotification(`تم توثيق الردود اليومية على التواصل الاجتماعي`);
    setSocialMessages(''); setSocialComments('');
    alert("تم حفظ وتوثيق نشاط اليوم بنجاح.");
  };

  const handleDeleteSocialLog = (id) => {
    if (currentUser.role !== 'admin') { alert("حذف السجلات مخصص للأدمن فقط."); return; }
    if (confirm("حذف هذا السجل؟")) {
      const updatedLogs = socialLogs.filter(l => l.id !== id);
      setSocialLogs(updatedLogs);
      syncWithServer(undefined, updatedLogs, undefined);
    }
  };

  const handleSaveTeamMember = (e) => {
    e.preventDefault();
    if (currentUser.role !== 'admin') { alert("إدارة الفريق مخصصة للأدمن فقط."); return; }
    if (!newMemberName.trim() || !newMemberPass.trim()) { alert("يرجى إدخال الاسم وكلمة المرور!"); return; }

    const usernameKey = (newMemberUsername.trim() || newMemberName.trim()).toLowerCase().replace(/\s+/g, '_');
    
    const updatedAccounts = { ...employeeAccounts };
    if (editingMemberKey && editingMemberKey !== usernameKey) {
      delete updatedAccounts[editingMemberKey];
    }
    updatedAccounts[usernameKey] = {
      name: newMemberName.trim(),
      role: newMemberRole,
      pass: newMemberPass.trim()
    };

    setEmployeeAccounts(updatedAccounts);
    syncWithServer(undefined, undefined, updatedAccounts);
    setNewMemberName(''); setNewMemberUsername(''); setNewMemberPass(''); setEditingMemberKey(null);
    alert(editingMemberKey ? "تم تحديث بيانات العضو بنجاح." : "تم إضافة العضو بنجاح.");
  };

  const handleStartEditMember = (key, acc) => {
    if (currentUser.role !== 'admin') { alert("تعديل الفريق مخصص للأدمن فقط."); return; }
    setEditingMemberKey(key);
    setNewMemberName(acc.name);
    setNewMemberUsername(key);
    setNewMemberRole(acc.role);
    setNewMemberPass(acc.pass);
  };

  const handleDeleteTeamMember = (usernameKey) => {
    if (currentUser.role !== 'admin') { alert("حذف الفريق مخصص للأدمن فقط."); return; }
    if (usernameKey === 'حازم') { alert("لا يمكن حذف حساب المسؤول الأساسي!"); return; }
    if (confirm("هل أنت متأكد من حذف هذا الموظف؟")) {
      const updatedAccounts = { ...employeeAccounts };
      delete updatedAccounts[usernameKey];
      setEmployeeAccounts(updatedAccounts);
      syncWithServer(undefined, undefined, updatedAccounts);
    }
  };

  const archivedTasks = tasks.filter(t => t.stage === 'منجز ومؤرشف');
  const countByType = (type) => archivedTasks.filter(t => t.contentType === type).length;
  
  const totalMessages = socialLogs.reduce((acc, curr) => acc + curr.messagesCount, 0);
  const totalComments = socialLogs.reduce((acc, curr) => acc + curr.commentsCount, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B132B] flex items-center justify-center text-[#00F5D4] font-black text-xl" dir="rtl">
        جاري الاتصال بالسيرفر السحابي وتحميل البيانات... ⏳
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0B132B] flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="bg-[#1C2541] border border-[#00F5D4]/30 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6 text-white">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 mx-auto bg-white rounded-full p-1 shadow-md border border-[#00F5D4] flex items-center justify-center">
              <span className="text-xs font-bold text-[#0B132B]">الكفيل</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-[#00F5D4]">مستشفى الكفيل التخصصي</h2>
            <p className="text-xs md:text-sm text-gray-300 font-semibold">شعبة الإعلام — النظام السحابي المركزي</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-300 font-bold mb-1 text-xs md:text-sm">اسم المستخدم (الموظف)</label>
              <input type="text" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} placeholder="اسم المستخدم (مثال: حازم)..." className="w-full px-4 py-3 bg-white text-gray-900 font-semibold rounded-xl text-sm outline-none" required />
            </div>
            <div>
              <label className="block text-gray-300 font-bold mb-1 text-xs md:text-sm">كلمة المرور</label>
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="كلمة المرور..." className="w-full px-4 py-3 bg-white text-gray-900 font-semibold rounded-xl text-sm outline-none" required />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-[#00F5D4] to-[#4EA8DE] text-[#0B132B] py-3 rounded-xl font-black text-sm shadow-md">
              تسجيل الدخول للنظام 🔑
            </button>
          </form>
        </div>
      </div>
    );
  }

  const allTabs = [
    { name: 'الرئيسية', icon: '🏠' },
    { name: '1. التصوير', icon: '📷', role: 'cameraman' },
    { name: '1.5. التدقيق الفيديوي', icon: '🎥', role: 'checker' },
    { name: '3. التحرير', icon: '✏', role: 'editor' },
    { name: '4. التصميم', icon: '🎨', role: 'designer' },
    { name: '5. المونتاج', icon: '🎬', role: 'montage' },
    { name: '6. التدقيق النهائي', icon: '✔', role: 'checker' },
    { name: '7. النشر', icon: '🚀', role: 'publisher' },
    { name: '8. الرد على التواصل الاجتماعي', icon: '💬', role: 'social' },
    { name: 'التقارير النهائية', icon: '📊', role: 'hr' }, 
    { name: 'إدارة الفريق', icon: '👥', role: 'admin' }, 
    { name: 'النسخ الاحتياطي', icon: '⬇', role: 'admin' }
  ];

  const isAllowedToManageSection = (sectionName) => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'editor' && (sectionName === '3. التحرير' || sectionName === '1.5. التدقيق الفيديوي')) return true;
    if (currentUser.role === 'checker' && (sectionName === '1.5. التدقيق الفيديوي' || sectionName === '6. التدقيق النهائي')) return true;
    if (currentUser.role === 'cameraman' && sectionName === '1. التصوير') return true;
    if (currentUser.role === 'designer' && sectionName === '4. التصميم') return true;
    if (currentUser.role === 'montage' && sectionName === '5. المونتاج') return true;
    if (currentUser.role === 'publisher' && sectionName === '7. النشر') return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-gray-100 flex flex-col md:flex-row font-sans select-none" dir="rtl">
      
      {/* رأس الشاشة للموبايل */}
      <div className="md:hidden bg-[#1C2541] p-4 flex justify-between items-center border-b border-[#00F5D4]/20">
        <span className="text-[#00F5D4] font-black text-sm">إدارة الإعلام المركزي</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="bg-[#0B132B] text-[#00F5D4] px-3 py-1.5 rounded-lg border border-[#00F5D4]/40 text-xs font-bold">
          {isMobileMenuOpen ? 'إغلاق ✕' : 'القائمة ☰'}
        </button>
      </div>

      {/* القائمة الجانبية */}
      <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:flex w-full md:w-72 bg-[#1C2541] border-l border-[#00F5D4]/25 flex-col justify-between shadow-2xl print:hidden`}>
        <div>
          <div className="p-6 border-b border-[#00F5D4]/20 space-y-3 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-white rounded-full p-1 shadow-lg border-2 border-[#00F5D4] flex items-center justify-center">
                <span className="text-[10px] font-black text-[#0B132B]">الكفيل</span>
              </div>
              <div className="text-[#00F5D4] font-bold text-xs">شبكة الإعلام الطبي</div>
            </div>
            <div className="pt-2 text-xs bg-[#0B132B] p-2.5 rounded-xl text-gray-200 font-semibold flex justify-between items-center border border-[#00F5D4]/30">
              <span>👤 {currentUser.name}</span>
              <span className="text-[10px] bg-[#1C2541] text-[#00F5D4] px-2 py-0.5 rounded border border-[#00F5D4]/50">{currentUser.role}</span>
            </div>
          </div>

          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-260px)]">
            {allTabs.map((item) => (
              <button
                key={item.name}
                onClick={() => { setActiveTab(item.name); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                  activeTab === item.name 
                    ? 'bg-gradient-to-r from-[#00F5D4] to-[#4EA8DE] text-[#0B132B] shadow-lg font-black border-r-4 border-white' 
                    : 'text-gray-300 hover:bg-[#0B132B] hover:text-[#00F5D4]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-[#00F5D4]/20 space-y-2 bg-[#161F38]">
          <button onClick={handleLogout} className="w-full bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 py-2.5 rounded-xl text-xs font-bold">
            تسجيل الخروج 🚪
          </button>
          <p className="text-[10px] text-[#00F5D4] text-center font-bold">حالة النظام: {syncStatus}</p>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0B132B]">
        
        <header className="hidden md:flex bg-[#1C2541] px-8 py-4 border-b border-[#00F5D4]/20 justify-between items-center shadow-sm print:hidden">
          <div>
            <h1 className="text-2xl font-black text-[#00F5D4]">{activeTab}</h1>
            <p className="text-xs text-gray-300 mt-0.5">النظام السحابي المركزي — مستشفى الكفيل التخصصي</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* جرس الإشعارات */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="bg-[#0B132B] text-[#00F5D4] border border-[#00F5D4]/40 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 relative"
              >
                <span>🔔 الإشعارات</span>
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-black">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute left-0 mt-2 w-80 bg-[#161F38] border border-[#00F5D4]/40 rounded-xl shadow-2xl p-4 z-50 space-y-2 max-h-72 overflow-y-auto">
                  <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                    <span className="text-xs font-bold text-[#00F5D4]">سجل التنبيهات الحية</span>
                    <button onClick={() => setNotifications([])} className="text-[10px] text-gray-400 hover:text-white">مسح الكل</button>
                  </div>
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div key={n.id} className="text-xs bg-[#0B132B] p-2 rounded border border-gray-800 text-gray-200">
                        <p>{n.text}</p>
                        <span className="text-[9px] text-cyan-400">{n.time}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-4">لا توجد إشعارات جديدة</p>
                  )}
                </div>
              )}
            </div>

            <span className="text-xs font-bold text-[#00F5D4] bg-[#0B132B] border border-[#00F5D4]/40 px-3 py-2 rounded-xl">
              {syncStatus}
            </span>
          </div>
        </header>

        <div className="p-4 md:p-8">
          
          {activeTab === 'الرئيسية' && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-[#1C2541] to-[#161F38] border border-[#00F5D4]/30 text-white p-6 md:p-8 rounded-2xl shadow-xl space-y-4">
                <h2 className="text-xl md:text-2xl font-black text-[#00F5D4]">لوحة التحكم المركزية وسير العمل</h2>
                <p className="text-xs md:text-sm text-gray-300 font-medium">مرحباً بك يا {currentUser.name} في نظام إدارة الإعلام بمستشفى الكفيل التخصصي.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1C2541] border border-[#00F5D4]/30 p-6 rounded-2xl shadow flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-gray-300">إجمالي الرسائل الواردة والمردود عليها</span>
                    <p className="text-3xl md:text-4xl font-black text-cyan-400 mt-2">{totalMessages} رسالة</p>
                  </div>
                  <span className="text-3xl">💬</span>
                </div>
                <div className="bg-[#1C2541] border border-[#00F5D4]/30 p-6 rounded-2xl shadow flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-gray-300">إجمالي التعليقات المنجزة والمردود عليها</span>
                    <p className="text-3xl md:text-4xl font-black text-teal-400 mt-2">{totalComments} تعليق</p>
                  </div>
                  <span className="text-3xl">✍️</span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-base md:text-lg font-bold text-[#00F5D4]">📊 تفصيل إنجاز أنواع المواد المنجزة</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'أخبار', count: countByType('أخبار'), color: 'text-blue-300' },
                    { label: 'إعلام طبي', count: countByType('إعلام طبي'), color: 'text-emerald-300' },
                    { label: 'إعلان مركز', count: countByType('إعلان مركز') + countByType('إعلان طبي'), color: 'text-teal-300' },
                    { label: 'نصيحة طبية', count: countByType('نصيحة طبية'), color: 'text-purple-300' },
                    { label: 'CV طبيب', count: countByType('CV طبيب') + countByType('معلومات عامة'), color: 'text-cyan-300' },
                    { label: 'كاروسيل', count: countByType('كاروسيل'), color: 'text-orange-300' },
                    { label: 'فيديو وبرومو', count: countByType('فيديو') + countByType('برومو'), color: 'text-pink-300' },
                    { label: 'إجمالي المنجز', count: archivedTasks.length, color: 'text-[#00F5D4]' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-[#1C2541] border border-[#00F5D4]/25 p-4 rounded-xl flex justify-between items-center shadow">
                      <span className="text-xs font-bold text-gray-200">{item.label}</span>
                      <span className={`text-xl md:text-2xl font-black ${item.color}`}>{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === '1. التصوير' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {canEditSection('cameraman') && (
                <div className="bg-[#1C2541] border border-[#00F5D4]/20 p-6 md:p-8 rounded-2xl shadow space-y-6">
                  <h2 className="text-lg md:text-xl font-bold text-white">📷 صفحة المصور: إضافة مادة جديدة</h2>
                  <form onSubmit={handleCameramanSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-200 font-bold mb-1 text-sm">عنوان المادة *</label>
                      <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="اسم المادة..." className="w-full px-4 py-2.5 bg-white text-gray-900 font-semibold rounded-xl text-sm outline-none" required />
                    </div>
                    <div>
                      <label className="block text-gray-200 font-bold mb-1 text-sm">اختر المصور 👤</label>
                      <select value={newCameramanName} onChange={(e) => setNewCameramanName(e.target.value)} className="w-full px-4 py-2.5 bg-white text-gray-900 font-semibold rounded-xl text-sm outline-none">
                        <option value="حيدر ضياء جابر">حيدر ضياء جابر</option>
                        <option value="ياسر محمد مهدي">ياسر محمد مهدي</option>
                        <option value={currentUser.name}>{currentUser.name} (الحساب الحالي)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-200 font-bold mb-1 text-sm">تاريخ التصوير والإضافة 📅</label>
                      <input type="date" value={newAddDate} onChange={(e) => setNewAddDate(e.target.value)} className="w-full px-4 py-2.5 bg-white text-gray-900 font-bold rounded-xl text-sm outline-none" style={{ colorScheme: 'light' }} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-200 font-bold mb-1 text-sm">نوع المادة</label>
                        <select value={newContentType} onChange={(e) => setNewContentType(e.target.value)} className="w-full px-4 py-2.5 bg-white text-gray-900 font-semibold rounded-xl text-sm outline-none">
                          <option value="أخبار">أخبار</option>
                          <option value="إعلام طبي">إعلام طبي</option>
                          <option value="إعلان مركز">إعلان مركز</option>
                          <option value="نصيحة طبية">نصيحة طبية</option>
                          <option value="CV طبيب">CV طبيب</option>
                          <option value="كاروسيل">كاروسيل</option>
                          <option value="فيديو">فيديو</option>
                          <option value="العمليات الجراحية">العمليات الجراحية 🏥</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-200 font-bold mb-1 text-sm">نوع التصوير</label>
                        <select value={newShootType} onChange={(e) => setNewShootType(e.target.value)} className="w-full px-4 py-2.5 bg-white text-gray-900 font-semibold rounded-xl text-sm outline-none">
                          <option value="فوتو">فوتو</option>
                          <option value="فيديو">فيديو</option>
                          <option value="فيديو وفوتو">فيديو وفوتو سوية</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-200 font-bold mb-1 text-sm">ملاحظات العمل أو التعديل 📝</label>
                      <textarea value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="ملاحظات..." className="w-full px-4 py-2 bg-white text-gray-900 font-medium rounded-xl text-sm outline-none h-20 resize-none"></textarea>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-[#00F5D4]/20">
                      <button type="submit" className="bg-gradient-to-r from-[#00F5D4] to-[#4EA8DE] text-[#0B132B] px-8 py-2.5 rounded-xl font-black text-sm shadow">حفظ وإرسال للتدقيق الفيديوي</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {activeTab === '1.5. التدقيق الفيديوي' && (
            <div className="space-y-4">
              <div className="bg-[#1C2541] border border-[#00F5D4]/20 p-6 rounded-2xl space-y-4 shadow">
                <h2 className="text-lg font-bold text-[#00F5D4]">متابعة قسم: التدقيق الفيديوي</h2>
                <div className="bg-[#0B132B] p-4 rounded-xl border border-[#00F5D4]/20 overflow-x-auto">
                  <table className="w-full text-right min-w-[700px]">
                    <thead>
                      <tr className="text-xs text-[#00F5D4] border-b border-gray-800">
                        <th className="p-3">عنوان المادة</th>
                        <th className="p-3">اختر مدقق الفيديو (طارق أو رشا) 🎥</th>
                        <th className="p-3 text-center">أزرار التحكم وإدارة المراحل</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-sm">
                      {tasks.filter(t => t.stage === '1.5. التدقيق الفيديوي').length > 0 ? (
                        tasks.filter(t => t.stage === '1.5. التدقيق الفيديوي').map(t => (
                          <VideoCheckerRow 
                            key={t.id} 
                            t={t} 
                            handleStageAction={handleStageAction} 
                            handleEditTaskTitle={handleEditTaskTitle} 
                            handleDeleteTask={handleDeleteTask} 
                            currentUser={currentUser}
                            videoCheckerSelections={videoCheckerSelections}
                            setVideoCheckerSelections={setVideoCheckerSelections}
                            isAllowed={isAllowedToManageSection('1.5. التدقيق الفيديوي')}
                          />
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="p-6 text-center text-gray-400 text-xs font-bold">لا توجد مواد حالياً في هذا القسم.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === '3. التحرير' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {canEditSection('editor') && (
                <div className="bg-[#1C2541] border border-[#00F5D4]/20 p-6 md:p-8 rounded-2xl shadow space-y-6">
                  <h2 className="text-lg md:text-xl font-bold text-white">✏️ صفحة المحرر: إضافة وتوجيه مادة جديدة</h2>
                  <form onSubmit={handleEditorSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-200 font-bold mb-1 text-sm">عنوان المادة التحريرية *</label>
                      <input type="text" value={editorTitle} onChange={(e) => setEditorTitle(e.target.value)} placeholder="عنوان الخبر..." className="w-full px-4 py-2.5 bg-white text-gray-900 font-semibold rounded-xl text-sm outline-none" required />
                    </div>
                    <div>
                      <label className="block text-gray-200 font-bold mb-1 text-sm">تاريخ إضافة المادة 📅</label>
                      <input type="date" value={editorAddDate} onChange={(e) => setEditorAddDate(e.target.value)} className="w-full px-4 py-2.5 bg-white text-gray-900 font-bold rounded-xl text-sm outline-none" style={{ colorScheme: 'light' }} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-200 font-bold mb-1 text-sm">نوع المادة</label>
                        <select value={editorContentType} onChange={(e) => setEditorContentType(e.target.value)} className="w-full px-4 py-2.5 bg-white text-gray-900 font-semibold rounded-xl text-sm outline-none">
                          <option value="أخبار">أخبار</option>
                          <option value="إعلام طبي">إعلام طبي</option>
                          <option value="إعلان مركز">إعلان مركز</option>
                          <option value="نصيحة طبية">نصيحة طبية</option>
                          <option value="CV طبيب">CV طبيب</option>
                          <option value="كاروسيل">كاروسيل</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-200 font-bold mb-1 text-sm">توجيه المادة إلى:</label>
                        <select value={editorTarget} onChange={(e) => setEditorTarget(e.target.value)} className="w-full px-4 py-2.5 bg-white text-gray-900 font-semibold rounded-xl text-sm outline-none">
                          <option value="4. التصميم">قسـم التصميم 🎨</option>
                          <option value="5. المونتاج">قسـم المونتاج 🎬</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-200 font-bold mb-1 text-sm">ملاحظات العمل 📝</label>
                      <textarea value={editorNotes} onChange={(e) => setEditorNotes(e.target.value)} placeholder="ملاحظات المحرر..." className="w-full px-4 py-2 bg-white text-gray-900 font-medium rounded-xl text-sm outline-none h-20 resize-none"></textarea>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-[#00F5D4]/20">
                      <button type="submit" className="bg-gradient-to-r from-[#00F5D4] to-[#4EA8DE] text-[#0B132B] px-8 py-2.5 rounded-xl font-black text-sm shadow">حفظ وإرسال للقسم المختار</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {activeTab === '4. التصميم' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {canEditSection('designer') && (
                <div className="bg-[#1C2541] border border-[#00F5D4]/20 p-6 md:p-8 rounded-2xl shadow space-y-6">
                  <h2 className="text-lg md:text-xl font-bold text-white">🎨 صفحة المصمم: إضافة مادة تصميم وتوجيهها للتدقيق النهائي</h2>
                  <form onSubmit={handleDesignerSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-200 font-bold mb-1 text-sm">عنوان التصميم *</label>
                      <input type="text" value={designerTitle} onChange={(e) => setDesignerTitle(e.target.value)} placeholder="اسم التصميم..." className="w-full px-4 py-2.5 bg-white text-gray-900 font-semibold rounded-xl text-sm outline-none" required />
                    </div>
                    <div>
                      <label className="block text-gray-200 font-bold mb-1 text-sm">تاريخ الإضافة 📅</label>
                      <input type="date" value={designerAddDate} onChange={(e) => setDesignerAddDate(e.target.value)} className="w-full px-4 py-2.5 bg-white text-gray-900 font-bold rounded-xl text-sm outline-none" style={{ colorScheme: 'light' }} />
                    </div>
                    <div>
                      <label className="block text-gray-200 font-bold mb-1 text-sm">نوع التصميم</label>
                      <select value={designerContentType} onChange={(e) => setDesignerContentType(e.target.value)} className="w-full px-4 py-2.5 bg-white text-gray-900 font-semibold rounded-xl text-sm outline-none">
                        <option value="إعلام طبي">إعلام طبي</option>
                        <option value="إعلان مركز">إعلان مركز</option>
                        <option value="نصيحة طبية">نصيحة طبية</option>
                        <option value="CV طبيب">CV طبيب</option>
                        <option value="كاروسيل">كاروسيل</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-200 font-bold mb-1 text-sm">ملاحظات العمل 📝</label>
                      <textarea value={designerNotes} onChange={(e) => setDesignerNotes(e.target.value)} placeholder="ملاحظات المصمم..." className="w-full px-4 py-2 bg-white text-gray-900 font-medium rounded-xl text-sm outline-none h-20 resize-none"></textarea>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-[#00F5D4]/20">
                      <button type="submit" className="bg-gradient-to-r from-[#00F5D4] to-[#4EA8DE] text-[#0B132B] px-8 py-2.5 rounded-xl font-black text-sm shadow">حفظ وإرسال للتدقيق النهائي والنشر</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {activeTab === '5. المونتاج' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {canEditSection('montage') && (
                <div className="bg-[#1C2541] border border-[#00F5D4]/20 p-6 md:p-8 rounded-2xl shadow space-y-6">
                  <h2 className="text-lg md:text-xl font-bold text-white">🎬 صفحة المونتير: إضافة وتوجيه فيديو جديد</h2>
                  <form onSubmit={handleMontageSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-200 font-bold mb-1 text-sm">عنوان الفيديو *</label>
                      <input type="text" value={montageTitle} onChange={(e) => setMontageTitle(e.target.value)} placeholder="اسم الفيديو..." className="w-full px-4 py-2.5 bg-white text-gray-900 font-semibold rounded-xl text-sm outline-none" required />
                    </div>
                    <div>
                      <label className="block text-gray-200 font-bold mb-1 text-sm">تاريخ الإضافة 📅</label>
                      <input type="date" value={montageAddDate} onChange={(e) => setMontageAddDate(e.target.value)} className="w-full px-4 py-2.5 bg-white text-gray-900 font-bold rounded-xl text-sm outline-none" style={{ colorScheme: 'light' }} />
                    </div>
                    <div>
                      <label className="block text-gray-200 font-bold mb-1 text-sm">نوع الفيديو</label>
                      <select value={montageContentType} onChange={(e) => setMontageContentType(e.target.value)} className="w-full px-4 py-2.5 bg-white text-gray-900 font-semibold rounded-xl text-sm outline-none">
                        <option value="فيديو">فيديو</option>
                        <option value="برومو">برومو</option>
                        <option value="تقرير فيديوي">تقرير فيديوي</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-200 font-bold mb-1 text-sm">ملاحظات العمل 📝</label>
                      <textarea value={montageNotes} onChange={(e) => setMontageNotes(e.target.value)} placeholder="ملاحظات المونتير..." className="w-full px-4 py-2 bg-white text-gray-900 font-medium rounded-xl text-sm outline-none h-20 resize-none"></textarea>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-[#00F5D4]/20">
                      <button type="submit" className="bg-gradient-to-r from-[#00F5D4] to-[#4EA8DE] text-[#0B132B] px-8 py-2.5 rounded-xl font-black text-sm shadow">حفظ وإرسال للتدقيق النهائي والنشر</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {activeTab === '6. التدقيق النهائي' && (
            <div className="space-y-4">
              <div className="bg-[#1C2541] border border-[#00F5D4]/20 p-6 rounded-2xl space-y-4 shadow">
                <h2 className="text-lg font-bold text-[#00F5D4]">متابعة قسم: التدقيق النهائي</h2>
                <div className="bg-[#0B132B] p-4 rounded-xl border border-[#00F5D4]/20 overflow-x-auto">
                  <table className="w-full text-right min-w-[700px]">
                    <thead>
                      <tr className="text-xs text-[#00F5D4] border-b border-gray-800">
                        <th className="p-3">عنوان المادة</th>
                        <th className="p-3">اختر مدقق التدقيق النهائي (زهراء أو رشا) ✔️</th>
                        <th className="p-3 text-center">أزرار التحكم وإدارة المراحل</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-sm">
                      {tasks.filter(t => t.stage === '6. التدقيق النهائي').length > 0 ? (
                        tasks.filter(t => t.stage === '6. التدقيق النهائي').map(t => (
                          <FinalCheckerRow 
                            key={t.id} 
                            t={t} 
                            handleStageAction={handleStageAction} 
                            handleEditTaskTitle={handleEditTaskTitle} 
                            handleDeleteTask={handleDeleteTask} 
                            currentUser={currentUser}
                            finalCheckerSelections={finalCheckerSelections}
                            setFinalCheckerSelections={setFinalCheckerSelections}
                            isAllowed={isAllowedToManageSection('6. التدقيق النهائي')}
                          />
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="p-6 text-center text-gray-400 text-xs font-bold">لا توجد مواد حالياً في هذا القسم.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === '7. النشر' && (
            <div className="space-y-8">
              {canEditSection('publisher') && (
                <div className="bg-[#1C2541] border border-[#00F5D4]/20 p-6 md:p-8 rounded-2xl shadow space-y-6 max-w-3xl mx-auto">
                  <h2 className="text-lg md:text-xl font-bold text-white">🚀 قسم النشر: إضافة وإعادة نشر مادة جاهزة</h2>
                  <form onSubmit={handleDirectPublishSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-200 font-bold mb-1 text-sm">اسم المادة / العنوان *</label>
                      <input type="text" value={directPubTitle} onChange={(e) => setDirectPubTitle(e.target.value)} placeholder="مثال: CV الدكتور أحمد..." className="w-full px-4 py-2.5 bg-white text-gray-900 font-semibold rounded-xl text-sm outline-none" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-200 font-bold mb-1 text-sm">نوع المادة</label>
                        <select value={directPubType} onChange={(e) => setDirectPubType(e.target.value)} className="w-full px-4 py-2.5 bg-white text-gray-900 font-semibold rounded-xl text-sm outline-none">
                          <option value="أخبار">أخبار</option>
                          <option value="إعلام طبي">إعلام طبي</option>
                          <option value="إعلان مركز">إعلان مركز</option>
                          <option value="نصيحة طبية">نصيحة طبية</option>
                          <option value="CV طبيب">CV طبيب</option>
                          <option value="كاروسيل">كاروسيل</option>
                          <option value="فيديو">فيديو</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-200 font-bold mb-1 text-sm">تاريخ النشر 📅</label>
                        <input type="date" value={directPubDate} onChange={(e) => setDirectPubDate(e.target.value)} className="w-full px-4 py-2.5 bg-white text-gray-900 font-bold rounded-xl text-sm outline-none" style={{ colorScheme: 'light' }} />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button type="submit" className="bg-gradient-to-r from-[#00F5D4] to-[#4EA8DE] text-[#0B132B] px-8 py-2.5 rounded-xl font-black text-sm shadow">نشر وتوثيق المادة مباشرة 🚀</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {activeTab === '8. الرد على التواصل الاجتماعي' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {canEditSection('social') && (
                <div className="bg-[#1C2541] border border-[#00F5D4]/20 p-6 md:p-8 rounded-2xl shadow space-y-6">
                  <h2 className="text-lg md:text-xl font-bold text-[#00F5D4]">💬 تسجيل نشاط الرد على الرسائل والتعليقات اليومي</h2>
                  <form onSubmit={handleSocialSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-200 font-bold mb-1 text-sm">التاريخ 📅</label>
                        <input type="date" value={socialDate} onChange={(e) => setSocialDate(e.target.value)} className="w-full px-4 py-2.5 bg-white text-gray-900 font-bold rounded-xl text-sm outline-none" style={{ colorScheme: 'light' }} />
                      </div>
                      <div>
                        <label className="block text-gray-200 font-bold mb-1 text-sm">عدد الرسائل المضافة</label>
                        <input type="number" min="0" value={socialMessages} onChange={(e) => setSocialMessages(e.target.value)} placeholder="0" className="w-full px-4 py-2.5 bg-white text-gray-900 font-semibold rounded-xl text-sm outline-none" />
                      </div>
                      <div>
                        <label className="block text-gray-200 font-bold mb-1 text-sm">عدد التعليقات المضافة</label>
                        <input type="number" min="0" value={socialComments} onChange={(e) => setSocialComments(e.target.value)} placeholder="0" className="w-full px-4 py-2.5 bg-white text-gray-900 font-semibold rounded-xl text-sm outline-none" />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button type="submit" className="bg-gradient-to-r from-[#00F5D4] to-[#4EA8DE] text-[#0B132B] px-6 py-2.5 rounded-xl font-black text-sm shadow">حفظ وتوثيق النشاط اليومي</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {activeTab === 'إدارة الفريق' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="bg-[#1C2541] border border-[#00F5D4]/20 p-6 rounded-2xl shadow flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#00F5D4]">👥 إدارة أعضاء فريق شعبة الإعلام</h2>
                {currentUser.role === 'admin' && (
                  <span className="text-xs text-amber-300 bg-amber-950/60 px-3 py-1 rounded border border-amber-800">صلاحيات الأدمن مفعلة ⚡</span>
                )}
              </div>
            </div>
          )}

          {activeTab === 'التقارير النهائية' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="bg-[#1C2541] border border-[#00F5D4]/20 p-6 rounded-2xl shadow flex justify-between items-center print:hidden">
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white">📊 التقرير الشهري النهائي المخصص للطباعة</h2>
                </div>
                <button onClick={() => window.print()} className="bg-gradient-to-r from-[#00F5D4] to-[#4EA8DE] text-[#0B132B] px-6 py-2.5 rounded-xl font-black text-xs shadow flex items-center gap-2">
                  <span>🖨️</span> طباعة التقرير الشهري
                </button>
              </div>
            </div>
          )}

          {activeTab === 'النسخ الاحتياطي' && (
            <div className="space-y-6 max-w-xl mx-auto">
              {currentUser.role === 'admin' ? (
                <div className="bg-[#1C2541] border border-[#00F5D4]/20 p-8 rounded-2xl shadow text-center space-y-6">
                  <h2 className="text-xl font-bold text-white">النسخ الاحتياطي السحابي</h2>
                  <button onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ tasks, socialLogs, employeeAccounts }, null, 2));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href", dataStr);
                    downloadAnchor.setAttribute("download", "alkafeel_media_backup.json");
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                  }} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow">
                    تصدير نسخة احتياطية محلية (JSON) 💾
                  </button>
                </div>
              ) : (
                <div className="p-8 text-center bg-[#1C2541] rounded-xl text-gray-400 font-bold text-sm">
                  🔒 هذا القسم مخصص لمدير النظام (الأدمن) فقط.
                </div>
              )}
            </div>
          )}

        </div>
      </main>

    </div>
  );
}

function VideoCheckerRow({ t, handleStageAction, handleEditTaskTitle, handleDeleteTask, currentUser, videoCheckerSelections, setVideoCheckerSelections, isAllowed }) {
  const currentVal = videoCheckerSelections[t.id] || 'طارق جعفر حسين';
  return (
    <tr className={`hover:bg-gray-900/50 ${!isAllowed ? 'opacity-50 grayscale' : ''} ${t.hasError ? 'bg-red-950/30 border-r-4 border-red-500' : ''}`}>
      <td className="p-3 font-bold text-white flex items-center gap-2">
        {t.hasError && <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">⚠️ تعديل</span>}
        <span>{t.title}</span>
      </td>
      <td className="p-3">
        <select 
          value={currentVal} 
          onChange={(e) => setVideoCheckerSelections(prev => ({ ...prev, [t.id]: e.target.value }))}
          disabled={!isAllowed}
          className="px-3 py-1.5 bg-white text-gray-900 font-bold rounded-lg text-xs outline-none disabled:opacity-50"
        >
          <option value="طارق جعفر حسين">طارق جعفر حسين</option>
          <option value="رشا ناجح">رشا ناجح</option>
        </select>
      </td>
      <td className="p-3 text-center flex justify-center gap-2 flex-wrap">
        {isAllowed ? (
          <>
            <button onClick={() => handleStageAction(t.id, '1.5. التدقيق الفيديوي', 'return')} className="px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800 rounded-lg text-xs font-bold">⬅ إرجاع</button>
            <button onClick={() => handleStageAction(t.id, '1.5. التدقيق الفيديوي', 'advance')} className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-bold">إرسال للتحرير ➡</button>
          </>
        ) : (
          <span className="text-xs text-gray-500 font-bold bg-gray-900 px-3 py-1 rounded border border-gray-800">قفل 🔒</span>
        )}
      </td>
    </tr>
  );
}

function FinalCheckerRow({ t, handleStageAction, handleEditTaskTitle, handleDeleteTask, currentUser, finalCheckerSelections, setFinalCheckerSelections, isAllowed }) {
  const currentVal = finalCheckerSelections[t.id] || 'زهراء صلاح';
  return (
    <tr className={`hover:bg-gray-900/50 ${!isAllowed ? 'opacity-50 grayscale' : ''} ${t.hasError ? 'bg-red-950/30 border-r-4 border-red-500' : ''}`}>
      <td className="p-3 font-bold text-white flex items-center gap-2">
        {t.hasError && <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">⚠️ تعديل</span>}
        <span>{t.title}</span>
      </td>
      <td className="p-3">
        <select 
          value={currentVal} 
          onChange={(e) => setFinalCheckerSelections(prev => ({ ...prev, [t.id]: e.target.value }))}
          disabled={!isAllowed}
          className="px-3 py-1.5 bg-white text-gray-900 font-bold rounded-lg text-xs outline-none disabled:opacity-50"
        >
          <option value="زهراء صلاح">زهراء صلاح</option>
          <option value="رشا ناجح">رشا ناجح</option>
        </select>
      </td>
      <td className="p-3 text-center flex justify-center gap-2 flex-wrap">
        {isAllowed ? (
          <>
            <button onClick={() => handleStageAction(t.id, '6. التدقيق النهائي', 'return')} className="px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800 rounded-lg text-xs font-bold">⬅ إرجاع</button>
            <button onClick={() => handleStageAction(t.id, '6. التدقيق النهائي', 'advance')} className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-bold">إرسال للنشر ➡</button>
          </>
        ) : (
          <span className="text-xs text-gray-500 font-bold bg-gray-900 px-3 py-1 rounded border border-gray-800">قفل 🔒</span>
        )}
      </td>
    </tr>
  );
}