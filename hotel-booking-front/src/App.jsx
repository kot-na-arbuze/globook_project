import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HotelSearch from './pages/HotelSearch';
import BookingsList from './pages/BookingsList';
import Account from './pages/Account';

import BookingModal from './components/BookingModal';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import RecoverModal from './components/RecoverModal';

import './App.css';

export const API_BASE = 'http://localhost:3000/api/v1';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [activeModal, setActiveModal] = useState(null); 
  const [currentUser, setCurrentUser] = useState(null); // Изначально null
  const [isLoading, setIsLoading] = useState(true);

  // Проверяем существование сессии при загрузке страницы
  useEffect(() => {
    fetch(`${API_BASE}/account/profile`, { credentials: 'include' })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Не авторизован');
      })
      .then(data => setCurrentUser(data))
      .catch(() => setCurrentUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const handleLogout = () => {
    // При классических сессиях для выхода достаточно очистить состояние или вызвать DELETE сессии,
    // но в нашей упрощенной схеме просто стираем юзера и кука сотрется/устареет.
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  if (isLoading) {
    return <div className="loading-screen">Загрузка Globook...</div>;
  }

  return (
    <div className="app-light-theme">
      <Header 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        setActiveModal={setActiveModal}
        user={currentUser}
        onLogout={handleLogout}
      />

      <main className="main-content container">
        {currentPage === 'landing' && (
          <div style={{padding: '40px 0', textAlign: 'center'}}>
            <h1>Добро пожаловать в Globook</h1>
            <p>Управляйте бронированиями легко и надежно.</p>
            <button className="btn" onClick={() => setCurrentPage('search')}>Перейти к поиску отелей 🔍</button>
          </div>
        )}
        {currentPage === 'search' && <HotelSearch setActiveModal={setActiveModal} user={currentUser} />}
        {currentPage === 'bookings' && <BookingsList setCurrentPage={setCurrentPage} />}
        {currentPage === 'account' && <Account user={currentUser} />}
      </main>

      <Footer />

      <BookingModal 
        isOpen={activeModal === 'booking'} 
        onClose={() => setActiveModal(null)} 
        user={currentUser} 
      />
      
      <LoginModal 
        isOpen={activeModal === 'login'} 
        onClose={() => setActiveModal(null)}
        onLoginSuccess={(user) => setCurrentUser(user)}
        onSwitchToRegister={() => setActiveModal('register')}
        onSwitchToRecover={() => setActiveModal('recover')}
      />
      
      <RegisterModal 
        isOpen={activeModal === 'register'} 
        onClose={() => setActiveModal(null)}
        onRegisterSuccess={(user) => setCurrentUser(user)}
        onSwitchToLogin={() => setActiveModal('login')}
      />
      
      <RecoverModal 
        isOpen={activeModal === 'recover'} 
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}