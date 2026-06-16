import React from 'react';
import logo from '../assets/globook_logo_NEW_black.png';

export default function Header({ 
  currentPage, 
  setCurrentPage, 
  setActiveModal, 
  user, 
  onLogout 
}) {
  return (
    <header className="navbar-light">
      <div className="container header-container">
        
        {/* ЛЕВО: Логотип (клик ведет на Лендинг) */}
        <div className="navbar-left">
          <a href="#landing" className="logo-link" onClick={() => setCurrentPage('landing')}>
            <img src={logo} alt="Globook Logo" className="header-logo" />
          </a>
        </div>

        {/* ЦЕНТР: Постоянная навигация */}
        <div className="navbar-center">
          <button 
            className={`nav-btn ${currentPage === 'search' ? 'active-page' : ''}`}
            onClick={() => setCurrentPage('search')}
          >
            🔍 Поиск отелей
          </button>
          <button 
            className="nav-btn btn-dashed"
            onClick={() => setActiveModal('booking')}
          >
            📅 Забронировать
          </button>
        </div>

        {/* ПРАВО: Динамический блок авторизации */}
        <div className="navbar-right">
          {user ? (
            /* Если ПОЛЬЗОВАТЕЛЬ ВОШЕЛ */
            <>
              <button 
                className={`btn ${currentPage === 'bookings' ? 'active-page' : ''}`}
                onClick={() => setCurrentPage('bookings')}
              >
                🧳 Бронирования
              </button>
              <button 
                className={`btn btn-accent ${currentPage === 'account' ? 'active-page' : ''}`}
                onClick={() => setCurrentPage('account')}
              >
                👤 Аккаунт ({user.firstName})
              </button>
              {/* Небольшая кнопка для демонстрации выхода */}
              <button className="btn-logout" onClick={onLogout} title="Выйти">🚪</button>
            </>
          ) : (
            /* Если НЕ ВОШЕЛ (Гость) */
            <>
              <button className="btn" onClick={() => setActiveModal('login')}>
                Вход
              </button>
              <button className="btn btn-accent" onClick={() => setActiveModal('register')}>
                Регистрация
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}