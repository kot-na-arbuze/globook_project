// src/pages/BookingsList.jsx
import React, { useState, useEffect } from 'react';
import { API_BASE } from '../App';

const STATUS_COLORS = {
  'Ожидает подтверждения': 'status-pending',
  'Подтверждено': 'status-confirmed',
  'Оплачено': 'status-paid',
  'Отменено': 'status-cancelled',
  'Завершено': 'status-done',
};

export default function BookingsList({ setCurrentPage, user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [payModal, setPayModal] = useState(null); // booking object

  // Менеджеры видят все бронирования
  const isManager = user?.permissions?.includes('view_all_bookings');

  const fetchBookings = () => {
    setLoading(true);
    const endpoint = isManager ? `${API_BASE}/bookings/all` : `${API_BASE}/bookings`;
    fetch(endpoint, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setBookings(Array.isArray(data) ? data : []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Отменить бронирование?')) return;
    const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
      method: 'POST', credentials: 'include'
    });
    if (res.ok) { fetchBookings(); }
    else {
      const d = await res.json();
      alert(d.error || 'Не удалось отменить');
    }
  };

  const handleConfirm = async (id) => {
    const res = await fetch(`${API_BASE}/bookings/${id}/confirm`, {
      method: 'POST', credentials: 'include'
    });
    if (res.ok) { fetchBookings(); }
  };

  const handlePay = async (booking, method) => {
    setPayingId(booking.id);
    const res = await fetch(`${API_BASE}/bookings/${booking.id}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ payment_method: method })
    });
    const data = await res.json();
    setPayingId(null);
    setPayModal(null);
    if (res.ok) { fetchBookings(); alert('Оплата прошла успешно! ✅'); }
    else { alert(data.error || 'Ошибка оплаты'); }
  };

  const calculateNights = (inDate, outDate) => {
    return Math.max(0, Math.ceil((new Date(outDate) - new Date(inDate)) / 86400000));
  };

  if (loading) return <div className="loading-page">Загрузка бронирований...</div>;

  return (
    <div className="bookings-page-container">
      <div className="page-header">
        <h1 className="page-main-title">
          {isManager ? '📋 Все бронирования' : '🧳 Мои бронирования'}
        </h1>
        {isManager && (
          <div className="manager-stats">
            <span>Всего: <strong>{bookings.length}</strong></span>
            <span>Ожидают: <strong>{bookings.filter(b => b.status === 'Ожидает подтверждения').length}</strong></span>
            <span>Оплачено: <strong>{bookings.filter(b => b.status === 'Оплачено').length}</strong></span>
          </div>
        )}
      </div>

      {bookings.length === 0 ? (
        <div className="empty-bookings-box animate-fade">
          <div className="empty-icon">🏨</div>
          <p>Бронирований пока нет</p>
          <button className="btn btn-accent" onClick={() => setCurrentPage('search')}>
            🔍 Найти отели
          </button>
        </div>
      ) : (
        <div className="bookings-list-grid">
          {bookings.map(booking => {
            const nights = calculateNights(booking.checkIn, booking.checkOut);
            const canPay = booking.status !== 'Оплачено' && booking.status !== 'Отменено' && booking.status !== 'Завершено';
            const canCancel = booking.status !== 'Отменено' && booking.status !== 'Завершено';

            return (
              <div key={booking.id} className="booking-three-parts-card animate-fade">
                {/* ЛЕВАЯ ЧАСТЬ — отель */}
                <div className="card-part-left">
                  <div className="booking-hotel-badge-rating">⭐ {booking.rating?.toFixed(1)}</div>
                  <div className="booking-hotel-image-wrapper">
                    <img src={booking.photo} alt={booking.hotelName} />
                  </div>
                  <div className="booking-hotel-info-block">
                    <h3 className="b-hotel-title">{booking.hotelName}</h3>
                    <p className="b-hotel-geo">📍 {booking.country}, {booking.city}</p>
                    <p className="b-hotel-geo">{booking.address}</p>
                    <p className="b-hotel-phone">📞 {booking.phone}</p>
                  </div>
                  {isManager && booking.user && (
                    <div className="booking-user-tag">👤 {booking.user.fullName}</div>
                  )}
                </div>

                {/* ЦЕНТРАЛЬНАЯ ЧАСТЬ — детали */}
                <div className="card-part-center">
                  <h4>🛏️ Размещение</h4>
                  <div className="room-spec-item"><span className="spec-label">Номер:</span><span className="spec-value font-highlight">{booking.roomName}</span></div>
                  <div className="room-spec-item"><span className="spec-label">Гостей:</span><span className="spec-value">{booking.guestsCount} чел.</span></div>
                  <div className="room-spec-item"><span className="spec-label">Заезд:</span><span className="spec-value">{new Date(booking.checkIn).toLocaleDateString('ru-RU')}</span></div>
                  <div className="room-spec-item"><span className="spec-label">Выезд:</span><span className="spec-value">{new Date(booking.checkOut).toLocaleDateString('ru-RU')}</span></div>
                  <div className="room-spec-item"><span className="spec-label">Ночей:</span><span className="spec-value">{nights}</span></div>
                  {booking.specialRequests && (
                    <div className="room-spec-item"><span className="spec-label">Пожелания:</span><span className="spec-value">{booking.specialRequests}</span></div>
                  )}
                </div>

                {/* ПРАВАЯ ЧАСТЬ — финансы и действия */}
                <div className="card-part-right">
                  <div className="financials-block">
                    <div className="b-total-cost">{booking.totalPrice?.toLocaleString('ru-RU')} ₽</div>
                    <div className="b-sub-price">{booking.pricePerNight?.toLocaleString('ru-RU')} ₽ / ночь</div>
                    {booking.paidAt && (
                      <div className="b-paid-at">Оплачено: {new Date(booking.paidAt).toLocaleDateString('ru-RU')}</div>
                    )}
                  </div>

                  <div className={`booking-status-badge ${STATUS_COLORS[booking.status] || ''}`}>
                    {booking.status}
                  </div>

                  <div className="booking-actions">
                    {/* Оплата (клиент, не оплачено) */}
                    {canPay && user?.permissions?.includes('pay_booking') && (
                      <button
                        className="btn btn-pay"
                        onClick={() => setPayModal(booking)}
                        disabled={payingId === booking.id}
                      >
                        💳 Оплатить
                      </button>
                    )}

                    {/* Подтверждение (менеджер) */}
                    {isManager && booking.status === 'Ожидает подтверждения' && (
                      <button className="btn btn-confirm" onClick={() => handleConfirm(booking.id)}>
                        ✅ Подтвердить
                      </button>
                    )}

                    {/* Отмена */}
                    {canCancel && (
                      <button className="btn btn-danger-action" onClick={() => handleCancel(booking.id)}>
                        Отменить
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* МОДАЛ ОПЛАТЫ */}
      {payModal && (
        <div className="modal-overlay" onClick={() => setPayModal(null)}>
          <div className="modal-window modal-pay" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setPayModal(null)}>&times;</button>
            <div className="modal-content">
              <h2>Оплата бронирования</h2>
              <div className="pay-summary">
                <p><strong>{payModal.hotelName}</strong></p>
                <p>{payModal.roomName}</p>
                <p>{new Date(payModal.checkIn).toLocaleDateString('ru-RU')} — {new Date(payModal.checkOut).toLocaleDateString('ru-RU')}</p>
                <div className="pay-total">{payModal.totalPrice?.toLocaleString('ru-RU')} ₽</div>
              </div>
              <h4>Выберите способ оплаты:</h4>
              <div className="pay-methods">
                <button className="btn btn-pay-method" onClick={() => handlePay(payModal, 'card')} disabled={!!payingId}>
                  💳 Банковская карта
                </button>
                <button className="btn btn-pay-method" onClick={() => handlePay(payModal, 'sbp')} disabled={!!payingId}>
                  📱 СБП
                </button>
                <button className="btn btn-pay-method" onClick={() => handlePay(payModal, 'cash')} disabled={!!payingId}>
                  💵 Наличные при заезде
                </button>
              </div>
              {payingId && <div className="loading-msg">Проводим оплату...</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}