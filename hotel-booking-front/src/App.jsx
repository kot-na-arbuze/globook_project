import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HotelSearch from './pages/HotelSearch';
import BookingsList from './pages/BookingsList';
import Account from './pages/Account';

// Импортируем наши изолированные модальные окна
import BookingModal from './components/BookingModal';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import RecoverModal from './components/RecoverModal';

import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [activeModal, setActiveModal] = useState(null); // 'booking', 'login', 'register', 'recover' или null
  
  const [currentUser, setCurrentUser] = useState({
    fullName: 'Иванов Иван Иванович',
    email: 'ivan@globook.com',
    phone: '+7 (999) 123-45-67',
    createdAt: '12.03.2026',
    roleName: 'Супер-Администратор',
    // Ниже перечисляем права, которые бэкенд отдаст фронтенду после сидирования
    permissions: [
      'create_role_type', 'edit_role_permissions', 'delete_role_type',
      'create_account', 'edit_account_variables', 'create_hotel', 
      'create_room', 'pay_booking', 'cancel_booking', 'view_directories'
    ]
  });

  return (
    <div className="app-light-theme">
      

      <Header 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        setActiveModal={setActiveModal}
        user={currentUser}
        onLogout={() => setCurrentUser(null)}
      />

      <main className="main-content container">
        {/* Здесь рендерятся ваши страницы в зависимости от currentPage */}
        {currentPage === 'landing' && <div>Главная страница</div>}
        {currentPage === 'search' && <HotelSearch />}
        {currentPage === 'bookings' && (
        <BookingsList setCurrentPage={setCurrentPage} />
      )}
        {currentPage === 'account' && (
        <Account user={currentUser} />
        )}
      </main>

      <Footer />

      {/* ПОДКЛЮЧАЕМ ВСЕ ОКНА. Они сами знают, когда им открываться */}
      <BookingModal 
        isOpen={activeModal === 'booking'} 
        onClose={() => setActiveModal(null)} 
        user={currentUser} 
      />
      
      <LoginModal 
        isOpen={activeModal === 'login'} 
        onClose={() => setActiveModal(null)}
        onSwitchToRegister={() => setActiveModal('register')}
        onSwitchToRecover={() => setActiveModal('recover')}
      />
      
      <RegisterModal 
        isOpen={activeModal === 'register'} 
        onClose={() => setActiveModal(null)}
        onSwitchToLogin={() => setActiveModal('login')}
      />
      
      <RecoverModal 
        isOpen={activeModal === 'recover'} 
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}