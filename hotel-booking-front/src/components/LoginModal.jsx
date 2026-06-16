import React from 'react';

export default function LoginModal({ isOpen, onClose, onSwitchToRegister, onSwitchToRecover }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <div className="modal-content">
          <h2>Вход в Globook</h2>
          <form onSubmit={(e) => { e.preventDefault(); alert('Вы успешно вошли!'); onClose(); }}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="your@email.com" required />
            </div>
            <div className="form-group">
              <label>Пароль</label>
              <input type="password" placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn-submit">Войти</button>
            
            <div className="modal-footer-links">
              <button type="button" className="btn-link-style" onClick={onSwitchToRecover}>
                Забыли пароль?
              </button>
              <button type="button" className="btn-link-style" onClick={onSwitchToRegister}>
                Нет аккаунта? Регистрация
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}