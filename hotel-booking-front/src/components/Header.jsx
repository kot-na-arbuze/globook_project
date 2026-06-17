// src/components/Header.jsx
import React from 'react';

export default function Header({ currentPage, setCurrentPage, setActiveModal, user, onLogout, openBooking }) {
  return (
    <header className="navbar-light">
      <div className="container header-container">

        {/* ЛОГО */}
        <div className="navbar-left">
          <a className="logo-link" onClick={() => setCurrentPage('landing')} style={{ cursor: 'pointer' }}>
            <span className="logo-text">🌍 Globook</span>
          </a>
        </div>

        {/* ЦЕНТР */}
        <div className="navbar-center">
          <button
            className={`nav-btn ${currentPage === 'search' ? 'active-page' : ''}`}
            onClick={() => setCurrentPage('search')}
          >
            🔍 Поиск отелей
          </button>
          {user && (
            <button className="nav-btn btn-dashed" onClick={() => openBooking()}>
              📅 Забронировать
            </button>
          )}
        </div>

        {/* ПРАВО */}
        <div className="navbar-right">
          {user ? (
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
                👤 {user.firstName}
              </button>
              <button className="btn-logout" onClick={onLogout} title="Выйти">🚪</button>
            </>
          ) : (
            <>
              <button className="btn" onClick={() => setActiveModal('login')}>Вход</button>
              <button className="btn btn-accent" onClick={() => setActiveModal('register')}>Регистрация</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}