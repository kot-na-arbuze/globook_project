import React from 'react';

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <div className="modal-content">
          <h2>Регистрация аккаунта</h2>
          <form onSubmit={(e) => { e.preventDefault(); alert('Регистрация успешна!'); onClose(); }}>
            <div className="form-group">
              <label>Фамилия</label>
              <input type="text" placeholder="Иванов" required />
            </div>
            <div className="form-group">
              <label>Имя</label>
              <input type="text" placeholder="Иван" required />
            </div>
            <div className="form-group">
              <label>Отчество</label>
              <input type="text" placeholder="Иванович" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="example@mail.com" required />
            </div>
            <div className="form-group">
              <label>Номер телефона</label>
              <input 
                type="tel" 
                placeholder="+7 (999) 999-99-99" 
                pattern="^(\+7|8)\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$" 
                title="Формат: +7 (999) 999-99-99" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Пароль</label>
              <input type="password" placeholder="••••••••" required />
            </div>
            <div className="form-group">
              <label>Повтор пароля</label>
              <input type="password" placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn-submit">Зарегистрироваться</button>
            
            <button type="button" className="btn-link-style" onClick={onSwitchToLogin}>
              Уже есть аккаунт? Войти
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}