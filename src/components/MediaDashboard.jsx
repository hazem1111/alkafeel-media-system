const loadData = () => {
    setIsLoading(true);

    // 1. القراءة الفورية من التخزين المحلي لضمان عدم ضياع أي بيانات سابقة
    let cachedTasks = [];
    try {
      const savedTasks = localStorage.getItem('alkafeel_media_tasks_data');
      if (savedTasks) {
        cachedTasks = JSON.parse(savedTasks);
        setTasks(cachedTasks);
        generateNotifications(cachedTasks);
      }

      const savedSocial = localStorage.getItem('alkafeel_media_social_data');
      if (savedSocial) {
        setSocialLogs(JSON.parse(savedSocial));
      }

      const savedAccounts = localStorage.getItem('alkafeel_media_accounts_data');
      if (savedAccounts) {
        setEmployeeAccounts(prev => ({ ...prev, ...JSON.parse(savedAccounts) }));
      }
    } catch (e) {
      console.error("خطأ في قراءة البيانات المحلية:", e);
    }

    const endpoint = serverMode === 'local' ? 'http://localhost:10000/api/data' : '/api/data';

    // 2. محاولة المزامنة مع السيرفر إن وجد
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        if (data && data.tasks && Array.isArray(data.tasks)) {
          setTasks(data.tasks);
          localStorage.setItem('alkafeel_media_tasks_data', JSON.stringify(data.tasks));
          generateNotifications(data.tasks);
        } else if (cachedTasks.length === 0) {
          // في حال عدم وجود أي بيانات محلية أو سحابية، نضع المهمة التوضيحية
          const defaultTasks = [
            { 
              id: 1, 
              title: 'تغطية عملية زراعة الكلى المعقدة', 
              contentType: 'العمليات الجراحية', 
              shootType: 'فيديو', 
              addDate: '2026-10-01',
              cameraman: 'حيدر ضياء جابر',
              cameramanDate: '01-10-2026',
              videoChecker: 'طارق جعفر حسين',
              videoCheckerDate: '01-10-2026',
              editorName: 'طارق جعفر حسين',
              editorDate: '01-10-2026',
              designerName: 'علي صالح مشحوف',
              designerDate: '01-10-2026',
              checkerName: 'زهراء صلاح',
              checkerDate: '01-10-2026',
              publisherName: 'فريق النشر',
              publisherDate: '01-10-2026',
              publishPlatforms: { facebook: true, telegram: true },
              publishState: 'نشر',
              stage: 'منجز ومؤرشف', 
              progress: 100,
              hasError: false,
              notes: 'عمل ممتاز'
            }
          ];
          setTasks(defaultTasks);
          localStorage.setItem('alkafeel_media_tasks_data', JSON.stringify(defaultTasks));
        }

        if (data && data.socialLogs && Array.isArray(data.socialLogs)) {
          setSocialLogs(data.socialLogs);
          localStorage.setItem('alkafeel_media_social_data', JSON.stringify(data.socialLogs));
        }

        if (data && data.employeeAccounts && typeof data.employeeAccounts === 'object') {
          const cleanedAccounts = { ...data.employeeAccounts };
          delete cleanedAccounts['hazem'];
          setEmployeeAccounts(prev => ({ ...prev, ...cleanedAccounts }));
          localStorage.setItem('alkafeel_media_accounts_data', JSON.stringify(cleanedAccounts));
        }

        setSyncStatus(serverMode === 'local' ? 'متصل بالسيرفر المحلي 🖥️' : 'متصل بالسيرفر السحابي ☁️');
        setIsLoading(false);
      })
      .catch(err => {
        console.warn("تعذر الاتصال بالسيرفر، الاعتماد على التخزين المحلي:", err);
        setSyncStatus('التخزين المحلي متصل ومحفوظ ✅');
        setIsLoading(false);
      });
  };

  const syncWithServer = (updatedTasks, updatedSocial, updatedAccounts) => {
    const finalTasks = updatedTasks !== undefined ? updatedTasks : tasks;
    const finalSocial = updatedSocial !== undefined ? updatedSocial : socialLogs;
    const finalAccounts = updatedAccounts !== undefined ? updatedAccounts : employeeAccounts;

    // 1. الحفظ الفوري المضمون في التخزين المحلي
    try {
      localStorage.setItem('alkafeel_media_tasks_data', JSON.stringify(finalTasks));
      localStorage.setItem('alkafeel_media_social_data', JSON.stringify(finalSocial));
      localStorage.setItem('alkafeel_media_accounts_data', JSON.stringify(finalAccounts));
    } catch (e) {
      console.error("خطأ في حفظ البيانات محلياً:", e);
    }

    generateNotifications(finalTasks);

    const endpoint = serverMode === 'local' ? 'http://localhost:10000/api/data' : '/api/data';
    setSyncStatus('جاري الحفظ... 🔄');

    const payload = {
      tasks: finalTasks,
      socialLogs: finalSocial,
      employeeAccounts: finalAccounts
    };

    // 2. إرسال النسخة للسيرفر في الخلفية
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(() => {
      setSyncStatus(serverMode === 'local' ? 'متصل بالسيرفر المحلي 🖥️' : 'متصل بالسيرفر السحابي ☁️');
    })
    .catch(err => {
      console.warn("حفظ محلي فقط:", err);
      setSyncStatus('تم الحفظ محلياً بنجاح ✅');
    });
  };