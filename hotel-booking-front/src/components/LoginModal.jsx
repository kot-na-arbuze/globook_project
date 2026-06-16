import React, { useState } from 'react';
import { API_BASE } from '../App';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, onSwitchToRegister, onSwitchToRecover }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Передаем куки сессии
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Запрашиваем профиль, чтобы получить полный объект с правами (permissions)
        const profileRes = await fetch(`${API_BASE}/account/profile`, { credentials: 'include' });
        const profileData = await profileRes.json();
        
        onLoginSuccess(profileData);
        onClose();
      } else {
        setError(data.error || 'Ошибка входа');
      }
    } catch (err) {
      setError('Не удалось связаться с сервером');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <div className="modal-content">
          <h2>Вход в Globook</h2>
          {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Пароль</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-submit">Войти</button>
            
            <div className="modal-footer-links">
              <button type="button" className="btn-link-style" onClick={onSwitchToRecover}>Забыли пароль?</button>
              <button type="button" className="btn-link-style" onClick={onSwitchToRegister}>Нет аккаунта? Регистрация</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}