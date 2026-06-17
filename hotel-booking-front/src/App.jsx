// src/App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import HotelSearch from './pages/HotelSearch';
import HotelPage from './pages/HotelPage';
import BookingsList from './pages/BookingsList';
import Account from './pages/Account';
import LoginModal from './components/modals/LoginModal';
import RegisterModal from './components/modals/RegisterModal';
import BookingModal from './components/modals/BookingModal';
import RecoverModal from './components/modals/RecoverModal';

export const API_BASE = 'http://localhost:3000/api/v1';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [activeModal, setActiveModal] = useState(null); // 'login' | 'register' | 'booking' | 'recover'
  const [user, setUser] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null); // для страницы отеля
  const [bookingTarget, setBookingTarget] = useState(null); // { roomId, hotel }

  // Восстанавливаем сессию при загрузке
  useEffect(() => {
    fetch(`${API_BASE}/account/profile`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data && data.id) setUser(data); })
      .catch(() => {});
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setActiveModal(null);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'DELETE', credentials: 'include' });
    } catch (e) {}
    setUser(null);
    setCurrentPage('landing');
  };

  const openBooking = (roomId = null, hotel = null) => {
    setBookingTarget({ roomId, hotel });
    setActiveModal('booking');
  };

  const navigateTo = (page, data = null) => {
    if (page === 'hotel' && data) setSelectedHotel(data);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing setCurrentPage={navigateTo} openBooking={openBooking} user={user} />;
      case 'search':
        return <HotelSearch setActiveModal={setActiveModal} user={user} openBooking={openBooking} navigateTo={navigateTo} />;
      case 'hotel':
        return <HotelPage hotel={selectedHotel} user={user} openBooking={openBooking} setCurrentPage={navigateTo} />;
      case 'bookings':
        return user
          ? <BookingsList setCurrentPage={navigateTo} user={user} />
          : <div className="centered-message">Войдите в аккаунт для просмотра бронирований.<button className="btn btn-accent" onClick={() => setActiveModal('login')}>Войти</button></div>;
      case 'account':
        return user
          ? <Account user={user} setUser={setUser} setCurrentPage={navigateTo} />
          : <div className="centered-message">Войдите в аккаунт.<button className="btn btn-accent" onClick={() => setActiveModal('login')}>Войти</button></div>;
      default:
        return <Landing setCurrentPage={navigateTo} openBooking={openBooking} user={user} />;
    }
  };

  return (
    <div className="app-root">
      <Header
        currentPage={currentPage}
        setCurrentPage={navigateTo}
        setActiveModal={setActiveModal}
        user={user}
        onLogout={handleLogout}
        openBooking={openBooking}
      />

      <main className="main-content">
        {renderPage()}
      </main>

      <Footer />

      {/* МОДАЛЬНЫЕ ОКНА */}
      <LoginModal
        isOpen={activeModal === 'login'}
        onClose={() => setActiveModal(null)}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setActiveModal('register')}
        onSwitchToRecover={() => setActiveModal('recover')}
      />
      <RegisterModal
        isOpen={activeModal === 'register'}
        onClose={() => setActiveModal(null)}
        onRegisterSuccess={handleLoginSuccess}
        onSwitchToLogin={() => setActiveModal('login')}
      />
      <BookingModal
        isOpen={activeModal === 'booking'}
        onClose={() => setActiveModal(null)}
        user={user}
        bookingTarget={bookingTarget}
        onAuthRequired={() => setActiveModal('login')}
        onSuccess={() => navigateTo('bookings')}
      />
      <RecoverModal
        isOpen={activeModal === 'recover'}
        onClose={() => setActiveModal(null)}
        onSwitchToLogin={() => setActiveModal('login')}
      />
    </div>
  );
}