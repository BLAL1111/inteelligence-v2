document.addEventListener('DOMContentLoaded', () => {
    // التحقق من التوكن
    if (!localStorage.getItem('iq-token')) {
      window.location.href = 'login.html';
      return;
    }
  
    // عرض بيانات وهمية
    loadContacts();
  
    // تسجيل الخروج
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      localStorage.removeItem('iq-token');
      window.location.href = 'login.html';
    });
  });
  
  function loadContacts() {
    const tbody = document.getElementById('contactsBody');
    if (!tbody) return;
  
    // بيانات وهمية
    const contacts = [
      { name: 'أحمد محمد', phone: '0501234567', store: 'ملابس', status: 'new', date: '2025-03-19' },
      { name: 'سارة خالد', phone: '0559876543', store: 'إلكترونيات', status: 'contacted', date: '2025-03-18' },
      { name: 'فيصل عمر', phone: '0561122334', store: 'عطور', status: 'converted', date: '2025-03-17' },
    ];
  
    tbody.innerHTML = contacts.map(c => {
      const statusClass = 
        c.status === 'new' ? 'status-new' :
        c.status === 'contacted' ? 'status-contacted' : 'status-converted';
      const statusText = 
        c.status === 'new' ? 'جديد' :
        c.status === 'contacted' ? 'تم التواصل' : 'تم التحويل';
      return `
        <tr>
          <td>${c.name}</td>
          <td>${c.phone}</td>
          <td>${c.store}</td>
          <td><span class="status-badge ${statusClass}">${statusText}</span></td>
          <td>${c.date}</td>
        </tr>
      `;
    }).join('');
  }