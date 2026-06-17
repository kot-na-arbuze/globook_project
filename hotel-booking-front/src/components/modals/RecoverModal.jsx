// src/components/modals/RecoverModal.jsx
import React, { useState } from 'react';

export default function RecoverModal({ isOpen, onClose }) {
  const [stage, setStage] = useState(1); // Состояние шага: 1, 2 или 3

  if (!isOpen) return null;

  const handleClose = () => {
    setStage(1); // сбрасываем на 1 шаг при закрытии
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose}>&times;</button>
        <div className="modal-content">
          <h2>Восстановление доступа</h2>
          <div className="steps-indicator">Шаг {stage} из 3</div>

          {stage === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStage(2); }}>
              <p className="step-desc">Введите ваш email — на него мы отправим проверочный код.</p>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="your@email.com" required />
              </div>
              <button type="submit" className="btn btn-submit">Далее</button>
            </form>
          )}

          {stage === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); setStage(3); }}>
              <p className="step-desc">Мы отправили код подтверждения. Введите его ниже:</p>
              <div className="form-group">
                <label>Код из письма</label>
                <input type="text" placeholder="6-значный код" maxLength="6" style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '20px' }} required />
              </div>
              <button type="submit" className="btn btn-submit">Проверить код</button>
            </form>
          )}

          {stage === 3 && (
            <form onSubmit={(e) => { e.preventDefault(); alert('Пароль изменён!'); handleClose(); }}>
              <p className="step-desc">Придумайте новый надёжный пароль для вашей учётной записи.</p>
              <div className="form-group">
                <label>Новый пароль</label>
                <input type="password" placeholder="••••••••" required />
              </div>
              <div className="form-group">
                <label>Повторите новый пароль</label>
                <input type="password" placeholder="••••••••" required />
              </div>
              <button type="submit" className="btn btn-submit">Сбросить пароль</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}