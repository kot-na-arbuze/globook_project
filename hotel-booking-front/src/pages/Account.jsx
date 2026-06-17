// src/pages/Account.jsx
import React, { useState } from 'react';
import { API_BASE } from '../App';

export default function Account({ user, setUser, setCurrentPage }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: user.firstName || '',
    last_name: user.lastName || '',
    patronymic: user.patronymic || '',
    phone: user.phone || '',
  });
  const [saveMsg, setSaveMsg] = useState('');

  if (!user) return <div className="centered-message">Пожалуйста, войдите в систему.</div>;

  const has = (key) => user.permissions?.includes(key);

  const handleSaveProfile = async () => {
    const res = await fetch(`${API_BASE}/account/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ user: editForm })
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data);
      setEditing(false);
      setSaveMsg('Профиль обновлён ✅');
      setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  return (
    <div className="account-page-layout">

      {/* КАРТОЧКА ПРОФИЛЯ */}
      <section className="profile-center-card animate-fade">
        <div className="avatar-placeholder">👤</div>
        {!editing ? (
          <>
            <h2 className="user-profile-fio">{user.fullName}</h2>
            <p className="user-profile-email">✉️ {user.email}</p>
            <p className="user-profile-phone">📱 {user.phone}</p>
            <div className="profile-divider"></div>
            <p className="user-profile-regdate">Дата регистрации: <strong>{user.createdAt}</strong></p>
            <div className="user-current-role-badge">Роль: {user.roleName}</div>
            {saveMsg && <div className="save-success">{saveMsg}</div>}
            <button className="btn btn-ghost btn-sm mt-sm" onClick={() => setEditing(true)}>✏️ Редактировать профиль</button>
          </>
        ) : (
          <div className="profile-edit-form">
            <div className="form-group"><label>Фамилия</label><input value={editForm.last_name} onChange={e => setEditForm({ ...editForm, last_name: e.target.value })} /></div>
            <div className="form-group"><label>Имя</label><input value={editForm.first_name} onChange={e => setEditForm({ ...editForm, first_name: e.target.value })} /></div>
            <div className="form-group"><label>Отчество</label><input value={editForm.patronymic} onChange={e => setEditForm({ ...editForm, patronymic: e.target.value })} /></div>
            <div className="form-group"><label>Телефон</label><input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} /></div>
            <div className="form-actions">
              <button className="btn btn-accent" onClick={handleSaveProfile}>Сохранить</button>
              <button className="btn btn-ghost" onClick={() => setEditing(false)}>Отмена</button>
            </div>
          </div>
        )}
      </section>

      {/* НАВИГАЦИЯ ВКЛАДОК */}
      <div className="account-tabs">
        <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          🏠 Обзор
        </button>
        {(has('view_all_bookings') || has('edit_booking')) && (
          <button className={`tab-btn ${activeTab === 'all-bookings' ? 'active' : ''}`} onClick={() => { setCurrentPage('bookings'); }}>
            📋 Все бронирования
          </button>
        )}
        {(has('create_hotel') || has('edit_hotel') || has('delete_hotel')) && (
          <button className={`tab-btn ${activeTab === 'hotels' ? 'active' : ''}`} onClick={() => setActiveTab('hotels')}>
            🏨 Управление отелями
          </button>
        )}
        {(has('create_account') || has('delete_account')) && (
          <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            👥 Пользователи
          </button>
        )}
        {(has('create_role_type') || has('edit_role_permissions')) && (
          <button className={`tab-btn ${activeTab === 'roles' ? 'active' : ''}`} onClick={() => setActiveTab('roles')}>
            🔑 Роли и права
          </button>
        )}
      </div>

      {/* СОДЕРЖИМОЕ ВКЛАДОК */}
      <section className="account-tab-content">
        {activeTab === 'profile' && <ProfileOverview user={user} has={has} setCurrentPage={setCurrentPage} />}
        {activeTab === 'hotels' && <HotelsManagement has={has} />}
        {activeTab === 'users' && <UsersManagement has={has} />}
        {activeTab === 'roles' && <RolesManagement />}
      </section>
    </div>
  );
}

// ---- ОБЗОР (RBAC-панель) ----
function ProfileOverview({ user, has, setCurrentPage }) {
  return (
    <div className="rbac-actions-section">
      <h3 className="actions-section-title">Доступные операции</h3>
      <div className="actions-dashboard-grid">

        {(has('create_role_type') || has('delete_role_type') || has('edit_role_permissions')) && (
          <div className="action-category-card">
            <h4>🔑 Настройки доступа и ролей</h4>
            <div className="buttons-stack">
              {has('create_role_type') && <button className="btn btn-dashboard">Создать тип аккаунта</button>}
              {has('edit_role_permissions') && <button className="btn btn-dashboard">Изменить разрешения</button>}
              {has('delete_role_type') && <button className="btn btn-dashboard btn-danger-text">Удалить тип аккаунта</button>}
            </div>
          </div>
        )}

        {(has('create_account') || has('delete_account') || has('edit_account_variables')) && (
          <div className="action-category-card">
            <h4>👥 Модерация пользователей</h4>
            <div className="buttons-stack">
              {has('create_account') && <button className="btn btn-dashboard">Создать аккаунт</button>}
              {has('edit_account_variables') && <button className="btn btn-dashboard">Параметры аккаунтов</button>}
              {has('delete_account') && <button className="btn btn-dashboard btn-danger-text">Удалить аккаунт</button>}
            </div>
          </div>
        )}

        {(has('create_hotel') || has('delete_hotel') || has('create_room') || has('delete_room')) && (
          <div className="action-category-card">
            <h4>🏢 Управление гостиничной сетью</h4>
            <div className="buttons-stack">
              {has('create_hotel') && <button className="btn btn-dashboard">Добавить отель</button>}
              {has('create_room') && <button className="btn btn-dashboard">Добавить номера</button>}
              {has('delete_hotel') && <button className="btn btn-dashboard btn-danger-text">Удалить отель</button>}
            </div>
          </div>
        )}

        {(has('pay_booking') || has('refund_payment') || has('view_personal_data')) && (
          <div className="action-category-card">
            <h4>💳 Финансы и ПДн</h4>
            <div className="buttons-stack">
              {has('pay_booking') && <button className="btn btn-dashboard" onClick={() => setCurrentPage('bookings')}>Перейти к оплате</button>}
              {has('refund_payment') && <button className="btn btn-dashboard btn-warn-text">Оформить возврат</button>}
              {has('view_personal_data') && <button className="btn btn-dashboard">Просмотр ПДн (ФЗ-152)</button>}
            </div>
          </div>
        )}

        {has('moderate_reviews') && (
          <div className="action-category-card">
            <h4>💬 Модерация</h4>
            <div className="buttons-stack">
              <button className="btn btn-dashboard">Модерация отзывов</button>
            </div>
          </div>
        )}

        {has('view_directories') && (
          <div className="action-category-card">
            <h4>📋 Системные реестры</h4>
            <div className="buttons-stack">
              <button className="btn btn-dashboard" onClick={() => setCurrentPage('bookings')}>
                Списки отелей / броней
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- УПРАВЛЕНИЕ ОТЕЛЯМИ ----
function HotelsManagement({ has }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editHotel, setEditHotel] = useState(null);
  const [form, setForm] = useState({ name: '', country: 'Россия', city: '', address: '', description: '', phone: '', rating: 8.0, photo_url: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/hotels/search`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setHotels(d))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setError('');
    const isEdit = !!editHotel;
    const url = isEdit ? `${API_BASE}/hotels/${editHotel.id}` : `${API_BASE}/hotels`;
    const method = isEdit ? 'PATCH' : 'POST';
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ hotel: form })
    });
    const data = await res.json();
    if (res.ok) {
      if (isEdit) setHotels(prev => prev.map(h => h.id === editHotel.id ? { ...h, ...data } : h));
      else setHotels(prev => [...prev, data]);
      setShowAddForm(false);
      setEditHotel(null);
      setForm({ name: '', country: 'Россия', city: '', address: '', description: '', phone: '', rating: 8.0, photo_url: '' });
    } else {
      setError(data.errors?.join(', ') || data.error || 'Ошибка сохранения');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить отель?')) return;
    const res = await fetch(`${API_BASE}/hotels/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) setHotels(prev => prev.filter(h => h.id !== id));
  };

  const openEdit = (hotel) => {
    setEditHotel(hotel);
    setForm({ name: hotel.name, country: hotel.country, city: hotel.city, address: hotel.address, description: hotel.description, phone: hotel.phone, rating: hotel.rating, photo_url: hotel.photo });
    setShowAddForm(true);
  };

  if (loading) return <div className="loading-msg">Загрузка отелей...</div>;

  return (
    <div className="hotels-management">
      <div className="management-header">
        <h3>Управление отелями ({hotels.length})</h3>
        {has('create_hotel') && !showAddForm && (
          <button className="btn btn-accent" onClick={() => setShowAddForm(true)}>+ Добавить отель</button>
        )}
      </div>

      {showAddForm && (
        <div className="hotel-form-card">
          <h4>{editHotel ? 'Редактировать отель' : 'Новый отель'}</h4>
          {error && <div className="form-error">{error}</div>}
          <div className="form-row">
            <div className="form-group"><label>Название *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="form-group"><label>Страна</label><input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} /></div>
            <div className="form-group"><label>Город</label><input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
            <div className="form-group"><label>Адрес</label><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
            <div className="form-group"><label>Телефон</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="form-group"><label>Рейтинг (1-10)</label><input type="number" min="1" max="10" step="0.1" value={form.rating} onChange={e => setForm({ ...form, rating: +e.target.value })} /></div>
            <div className="form-group" style={{ flex: '1 1 100%' }}><label>Описание</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} /></div>
            <div className="form-group" style={{ flex: '1 1 100%' }}><label>URL фото</label><input value={form.photo_url} onChange={e => setForm({ ...form, photo_url: e.target.value })} placeholder="https://..." /></div>
          </div>
          <div className="form-actions">
            <button className="btn btn-accent" onClick={handleSave}>Сохранить</button>
            <button className="btn btn-ghost" onClick={() => { setShowAddForm(false); setEditHotel(null); }}>Отмена</button>
          </div>
        </div>
      )}

      <div className="management-table">
        <div className="table-header-row">
          <span>Название</span><span>Город</span><span>Рейтинг</span><span>Номеров</span><span>Действия</span>
        </div>
        {hotels.map(hotel => (
          <div key={hotel.id} className="table-row">
            <span className="table-cell-main">{hotel.name}</span>
            <span>{hotel.city}</span>
            <span>⭐ {hotel.rating?.toFixed(1)}</span>
            <span>{hotel.availableRooms}</span>
            <span className="table-actions">
              {has('edit_hotel') && (
                <button className="btn-icon" onClick={() => openEdit(hotel)}>✏️</button>
              )}
              {has('delete_hotel') && (
                <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(hotel.id)}>🗑️</button>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ ----
function UsersManagement({ has }) {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', first_name: '', last_name: '', phone: '', role_id: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/users`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${API_BASE}/roles`, { credentials: 'include' }).then(r => r.json()),
    ]).then(([u, r]) => { setUsers(Array.isArray(u) ? u : []); setRoles(Array.isArray(r) ? r : []); })
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    setError('');
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ user: form })
    });
    const data = await res.json();
    if (res.ok) { setUsers(prev => [...prev, data]); setShowForm(false); setForm({ email: '', password: '', first_name: '', last_name: '', phone: '', role_id: '' }); }
    else { setError(data.errors?.join(', ') || 'Ошибка создания'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить аккаунт?')) return;
    const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) setUsers(prev => prev.filter(u => u.id !== id));
  };

  if (loading) return <div className="loading-msg">Загрузка пользователей...</div>;

  return (
    <div className="users-management">
      <div className="management-header">
        <h3>Пользователи ({users.length})</h3>
        {has('create_account') && !showForm && (
          <button className="btn btn-accent" onClick={() => setShowForm(true)}>+ Создать аккаунт</button>
        )}
      </div>

      {showForm && (
        <div className="hotel-form-card">
          <h4>Новый пользователь</h4>
          {error && <div className="form-error">{error}</div>}
          <div className="form-row">
            <div className="form-group"><label>Фамилия *</label><input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} /></div>
            <div className="form-group"><label>Имя *</label><input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} /></div>
            <div className="form-group"><label>Email *</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div className="form-group"><label>Пароль *</label><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
            <div className="form-group"><label>Телефон</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="form-group">
              <label>Роль *</label>
              <select value={form.role_id} onChange={e => setForm({ ...form, role_id: e.target.value })}>
                <option value="">Выберите роль</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-accent" onClick={handleCreate}>Создать</button>
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Отмена</button>
          </div>
        </div>
      )}

      <div className="management-table">
        <div className="table-header-row">
          <span>ФИО</span><span>Email</span><span>Роль</span><span>Дата рег.</span><span>Действия</span>
        </div>
        {users.map(u => (
          <div key={u.id} className="table-row">
            <span className="table-cell-main">{u.fullName}</span>
            <span>{u.email}</span>
            <span><span className={`role-badge role-${u.roleName?.toLowerCase()}`}>{u.roleName}</span></span>
            <span>{u.createdAt}</span>
            <span className="table-actions">
              {has('delete_account') && (
                <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(u.id)}>🗑️</button>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- УПРАВЛЕНИЕ РОЛЯМИ ----
function RolesManagement() {
  const [roles, setRoles] = useState([]);
  const [allPerms, setAllPerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoleName, setNewRoleName] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/roles`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${API_BASE}/permissions`, { credentials: 'include' }).then(r => r.json()),
    ]).then(([r, p]) => { setRoles(Array.isArray(r) ? r : []); setAllPerms(Array.isArray(p) ? p : []); })
      .finally(() => setLoading(false));
  }, []);

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;
    const res = await fetch(`${API_BASE}/roles`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ role: { name: newRoleName } })
    });
    const data = await res.json();
    if (res.ok) { setRoles(prev => [...prev, { ...data, permissions: [] }]); setNewRoleName(''); }
  };

  if (loading) return <div className="loading-msg">Загрузка ролей...</div>;

  return (
    <div className="roles-management">
      <div className="management-header">
        <h3>Роли и права</h3>
      </div>
      <div className="create-role-row">
        <input value={newRoleName} onChange={e => setNewRoleName(e.target.value)} placeholder="Название новой роли" />
        <button className="btn btn-accent" onClick={handleCreateRole}>Создать роль</button>
      </div>
      <div className="roles-list">
        {roles.map(role => (
          <div key={role.id} className="role-card">
            <h4>{role.name}</h4>
            <div className="role-permissions">
              {role.permissions?.map(p => (
                <span key={p} className="perm-tag">{p}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}