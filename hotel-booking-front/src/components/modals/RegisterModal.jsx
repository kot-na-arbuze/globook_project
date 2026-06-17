// src/components/modals/RegisterModal.jsx
import React, { useState } from 'react';
import { API_BASE } from '../../App';

export default function RegisterModal({ isOpen, onClose, onRegisterSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    lastName: '', firstName: '', patronymic: '',
    email: '', phone: '', password: '', passwordConfirmation: ''
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
    if (formData.password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
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
        const profileRes = await fetch(`${API_BASE}/account/profile`, { credentials: 'include' });
        const profile = await profileRes.json();
        onRegisterSuccess(profile);
        onClose();
      } else {
        setError(data.errors ? data.errors.join(', ') : 'Ошибка регистрации');
      }
    } catch {
      setError('Ошибка сети при регистрации');
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
          <h2>Регистрация в Globook</h2>
          {error && <div className="form-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row-half">
              <div className="form-group"><label>Фамилия *</label><input type="text" required onChange={upd('lastName')} /></div>
              <div className="form-group"><label>Имя *</label><input type="text" required onChange={upd('firstName')} /></div>
            </div>
            <div className="form-group"><label>Отчество</label><input type="text" onChange={upd('patronymic')} /></div>
            <div className="form-group"><label>Email *</label><input type="email" required onChange={upd('email')} /></div>
            <div className="form-group"><label>Телефон *</label><input type="tel" placeholder="+7 (999) 999-99-99" required onChange={upd('phone')} /></div>
            <div className="form-row-half">
              <div className="form-group"><label>Пароль *</label><input type="password" required onChange={upd('password')} /></div>
              <div className="form-group"><label>Повтор пароля *</label><input type="password" required onChange={upd('passwordConfirmation')} /></div>
            </div>
            <button type="submit" className="btn btn-submit" disabled={loading}>
              {loading ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
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