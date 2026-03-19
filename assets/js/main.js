document.addEventListener('DOMContentLoaded', () => {
  // استعادة التفضيلات
  initTheme();
  initLanguage();

  // Toggle الثيم
  document.querySelector('.theme-btn')?.addEventListener('click', toggleTheme);

  // Toggle اللغة
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const lang = e.target.dataset.lang;
      setLanguage(lang);
    });
  });

  // نموذج الاتصال
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }

  // قائمة الموبايل (بسيط)
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      document.querySelector('.nav-links').classList.toggle('show');
    });
  }
});

// دوال الثيم
function toggleTheme() {
  const body = document.body;
  if (body.classList.contains('dark-mode')) {
    body.classList.replace('dark-mode', 'light-mode');
    localStorage.setItem('iq-theme', 'light');
  } else {
    body.classList.replace('light-mode', 'dark-mode');
    localStorage.setItem('iq-theme', 'dark');
  }
}

function initTheme() {
  const saved = localStorage.getItem('iq-theme');
  if (saved === 'light') {
    document.body.classList.add('light-mode');
  } else {
    document.body.classList.add('dark-mode');
  }
}

// دوال اللغة
function setLanguage(lang) {
  // تحديث الأزرار
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // إخفاء/إظهار العناصر
  document.querySelectorAll('.ar, .en').forEach(el => {
    el.style.display = el.classList.contains(lang) ? '' : 'none';
  });

  // اتجاه الصفحة
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;

  localStorage.setItem('iq-lang', lang);
}

function initLanguage() {
  const saved = localStorage.getItem('iq-lang') || 'ar';
  setLanguage(saved);
}

// معالجة نموذج الاتصال (محاكاة)
async function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  const name = data.get('name');
  const phone = data.get('phone');

  if (!name || !phone) {
    showFormMessage('الاسم والهاتف مطلوبان', 'error');
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'جاري الإرسال...';
  btn.disabled = true;

  try {
    // محاكاة طلب API
    await new Promise(resolve => setTimeout(resolve, 1000));
    showFormMessage('تم الإرسال بنجاح! سنتواصل معك قريبًا.', 'success');
    form.reset();
  } catch (err) {
    showFormMessage('حدث خطأ، حاول مرة أخرى.', 'error');
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

function showFormMessage(msg, type) {
  const msgEl = document.getElementById('formMessage');
  if (msgEl) {
    msgEl.textContent = msg;
    msgEl.className = `form-message ${type}`;
    setTimeout(() => {
      msgEl.textContent = '';
      msgEl.className = 'form-message';
    }, 5000);
  }
}