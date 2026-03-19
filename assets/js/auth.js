// assets/js/auth.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    const token = localStorage.getItem('iq-token');
    if (token) {
      // Redirect to dashboard if on auth page
      if (window.location.pathname.includes('login.html')) {
        window.location.href = 'dashboard.html';
      }
    }
    
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const tab = this.dataset.tab;
        switchAuthTab(tab);
      });
    });
    
    // Login form
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
      
      // Enter key support
      loginForm.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleLogin(e);
        }
      });
    }
    
    // Register form
    const registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
      registerForm.addEventListener('submit', handleRegister);
      
      // Password strength checker
      const passwordInput = document.getElementById('regPassword');
      if (passwordInput) {
        passwordInput.addEventListener('input', checkPasswordStrength);
      }
      
      // Enter key support
      registerForm.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleRegister(e);
        }
      });
    }
  });
  
  function switchAuthTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.tab === tab) {
        btn.classList.add('active');
      }
    });
    
    // Show corresponding form
    document.querySelectorAll('.auth-form').forEach(form => {
      form.classList.remove('active');
    });
    document.getElementById(tab + 'Form').classList.add('active');
  }
  
  async function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    
    // Validation
    if (!email || !password) {
      showAuthMessage('loginMessage', 'البريد الإلكتروني وكلمة المرور مطلوبان', 'error');
      return;
    }
    
    if (password.length < 8) {
      showAuthMessage('loginMessage', 'كلمة المرور يجب أن تكون 8 أحرف على الأقل', 'error');
      return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'جاري تسجيل الدخول...';
    submitBtn.disabled = true;
    
    try {
      // Simulate login API call
      const response = await fakeAuthCall('/api/login', { email, password });
      
      if (response.success) {
        localStorage.setItem('iq-token', response.token);
        showAuthMessage('loginMessage', 'تم تسجيل الدخول بنجاح! جاري التحويل...', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1500);
      } else {
        showAuthMessage('loginMessage', 'البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
      }
    } catch (error) {
      showAuthMessage('loginMessage', 'حدث خطأ في الاتصال', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }
  
  async function handleRegister(e) {
    e.preventDefault();
    
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirm = form.password_confirmation.value;
    
    // Validation
    if (!name || !email || !password || !confirm) {
      showAuthMessage('registerMessage', 'جميع الحقول مطلوبة', 'error');
      return;
    }
    
    if (password.length < 8) {
      showAuthMessage('registerMessage', 'كلمة المرور يجب أن تكون 8 أحرف على الأقل', 'error');
      return;
    }
    
    if (password !== confirm) {
      showAuthMessage('registerMessage', 'كلمة المرور غير متطابقة', 'error');
      return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'جاري إنشاء الحساب...';
    submitBtn.disabled = true;
    
    try {
      // Simulate register API call
      const response = await fakeAuthCall('/api/register', { name, email, password });
      
      if (response.success) {
        localStorage.setItem('iq-token', response.token);
        showAuthMessage('registerMessage', 'تم إنشاء الحساب بنجاح! جاري التحويل...', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1500);
      } else {
        showAuthMessage('registerMessage', 'حدث خطأ في إنشاء الحساب', 'error');
      }
    } catch (error) {
      showAuthMessage('registerMessage', 'حدث خطأ في الاتصال', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }
  
  function checkPasswordStrength(e) {
    const password = e.target.value;
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthBar || !strengthText) return;
    
    // Simple strength check
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]+/)) strength += 1;
    if (password.match(/[A-Z]+/)) strength += 1;
    if (password.match(/[0-9]+/)) strength += 1;
    if (password.match(/[$@#&!]+/)) strength += 1;
    
    // Reset classes
    strengthBar.className = 'strength-bar';
    
    if (password.length === 0) {
      strengthBar.style.width = '0';
      updateStrengthText('أدخل كلمة مرور قوية', 'Enter a strong password');
    } else if (strength <= 2) {
      strengthBar.classList.add('weak');
      updateStrengthText('ضعيفة', 'Weak');
    } else if (strength <= 4) {
      strengthBar.classList.add('medium');
      updateStrengthText('متوسطة', 'Medium');
    } else {
      strengthBar.classList.add('strong');
      updateStrengthText('قوية', 'Strong');
    }
  }
  
  function updateStrengthText(arText, enText) {
    const strengthText = document.getElementById('strengthText');
    if (!strengthText) return;
    
    const arSpan = strengthText.querySelector('.ar');
    const enSpan = strengthText.querySelector('.en');
    
    if (arSpan) arSpan.textContent = arText;
    if (enSpan) enSpan.textContent = enText;
  }
  
  function showAuthMessage(elementId, message, type) {
    const messageEl = document.getElementById(elementId);
    if (messageEl) {
      messageEl.textContent = message;
      messageEl.className = 'auth-message ' + type;
      
      // Auto hide after 5 seconds
      setTimeout(() => {
        messageEl.textContent = '';
        messageEl.className = 'auth-message';
      }, 5000);
    }
  }
  
  // Fake auth API for demo
  function fakeAuthCall(url, data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful login/register
        resolve({
          success: true,
          token: 'fake-jwt-token-' + Math.random().toString(36).substring(7),
          user: {
            name: data.name || 'Test User',
            email: data.email
          }
        });
      }, 1000);
    });
  }