import React, { useState } from 'react';
import { API_BASE } from '../App';

export default function RegisterModal({ isOpen, onClose, onRegisterSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    lastName: '', firstName: '', patronymic: '', email: '', phone: '', password: '', passwordConfirmation: ''
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.passwordConfirmation) {
      setError('Пароли не совпадают!');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
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

      const data = await response.json();

      if (response.ok) {
        // После регистрации запрашиваем профиль с ролями
        const profileRes = await fetch(`${API_BASE}/account/profile`, { credentials: 'include' });
        const profileData = await profileRes.json();
        
        onRegisterSuccess(profileData);
        onClose();
      } else {
        setError(data.errors ? data.errors.join(', ') : 'Ошибка регистрации');
      }
    } catch (err) {
      setError('Ошибка сети при регистрации');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <div className="modal-content">
          <h2>Регистрация аккаунта</h2>
          {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Фамилия</label><input type="text" required onChange={e => setFormData({...formData, lastName: e.target.value})} /></div>
            <div className="form-group"><label>Имя</label><input type="text" required onChange={e => setFormData({...formData, firstName: e.target.value})} /></div>
            <div className="form-group"><label>Отчество</label><input type="text" onChange={e => setFormData({...formData, patronymic: e.target.value})} /></div>
            <div className="form-group"><label>Email</label><input type="email" required onChange={e => setFormData({...formData, email: e.target.value})} /></div>
            <div className="form-group"><label>Номер телефона</label><input type="tel" placeholder="+7 (999) 999-99-99" required onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
            <div className="form-group"><label>Пароль</label><input type="password" required onChange={e => setFormData({...formData, password: e.target.value})} /></div>
            <div className="form-group"><label>Повтор пароля</label><input type="password" required onChange={e => setFormData({...formData, passwordConfirmation: e.target.value})} /></div>
            
            <button type="submit" className="btn btn-submit">Зарегистрироваться</button>
            <button type="button" className="btn-link-style" onClick={onSwitchToLogin}>Уже есть аккаунт? Войти</button>
          </form>
        </div>
      </div>
    </div>
  );
}