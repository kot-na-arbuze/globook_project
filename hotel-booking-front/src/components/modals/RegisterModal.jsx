// src/components/modals/LoginModal.jsx
import React, { useState } from 'react';
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