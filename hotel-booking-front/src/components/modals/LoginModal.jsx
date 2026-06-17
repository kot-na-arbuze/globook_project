// src/components/modals/LoginModal.jsx
import { API_BASE } from '../../App';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, onSwitchToRegister, onSwitchToRecover }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        // Профиль уже возвращается из login, но для надёжности
        const profileRes = await fetch(`${API_BASE}/account/profile`, { credentials: 'include' });
        const profile = await profileRes.json();
        onLoginSuccess(profile);
        onClose();
      } else {
        setError(data.error || 'Ошибка входа');
      }
    } catch {
      setError('Не удалось связаться с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <div className="modal-content">
          <h2>Вход в Globook</h2>
          {error && <div className="form-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
            </div>
            <div className="form-group">
              <label>Пароль</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-submit" disabled={loading}>
              {loading ? 'Входим...' : 'Войти'}
            </button>
            <div className="modal-footer-links">
              <button type="button" className="btn-link-style" onClick={onSwitchToRecover}>Забыли пароль?</button>
              <button type="button" className="btn-link-style" onClick={onSwitchToRegister}>Нет аккаунта? Регистрация</button>
            </div>
          </form>
          <div className="demo-hint">
            <strong>Demo:</strong> client@globook.ru / client123
          </div>
        </div>
      </div>
    </div>
  );
}


// src/components/modals/RegisterModal.jsx
// (экспортируется в отдельный файл, здесь для удобства)
export function RegisterModal({ isOpen, onClose, onRegisterSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    lastName: '', firstName: '', patronymic: '', email: '', phone: '', password: '', passwordConfirmation: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.passwordConfirmation) {
      setError('Пароли не совпадают!');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            patronymic: formData.patronymic,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
          }
        })
      });
      const data = await res.json();
      if (res.ok) {
        const profile = await fetch(`${API_BASE}/account/profile`, { credentials: 'include' }).then(r => r.json());
        onRegisterSuccess(profile);
        onClose();
      } else {
        setError(data.errors ? data.errors.join(', ') : 'Ошибка регистрации');
      }
    } catch {
      setError('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  const upd = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <div className="modal-content">
          <h2>Регистрация</h2>
          {error && <div className="form-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row-half">
              <div className="form-group"><label>Фамилия *</label><input required onChange={upd('lastName')} /></div>
              <div className="form-group"><label>Имя *</label><input required onChange={upd('firstName')} /></div>
            </div>
            <div className="form-group"><label>Отчество</label><input onChange={upd('patronymic')} /></div>
            <div className="form-group"><label>Email *</label><input type="email" required onChange={upd('email')} /></div>
            <div className="form-group"><label>Телефон *</label><input type="tel" placeholder="+7 (999) 999-99-99" required onChange={upd('phone')} /></div>
            <div className="form-row-half">
              <div className="form-group"><label>Пароль *</label><input type="password" required onChange={upd('password')} /></div>
              <div className="form-group"><label>Повтор *</label><input type="password" required onChange={upd('passwordConfirmation')} /></div>
            </div>
            <button type="submit" className="btn btn-submit" disabled={loading}>
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
            <button type="button" className="btn-link-style" onClick={onSwitchToLogin}>
              Уже есть аккаунт? Войти
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Нужна локальная копия useState для RegisterModal
import { useState } from 'react';