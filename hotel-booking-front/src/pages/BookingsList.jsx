import React, { useState, useEffect } from 'react';
import { API_BASE } from '../App';

export default function BookingsList({ setCurrentPage }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    setLoading(true);
    fetch(`${API_BASE}/bookings`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.error('Ошибка загрузки бронирований:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const calculateNights = (inDate, outDate) => {
    const start = new Date(inDate);
    const end = new Date(outDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 0;
  };

  const handleCancel = async (id) => {
    if (window.confirm('Вы уверены, что хотите отменить это бронирование?')) {
      try {
        const response = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
          method: 'POST',
          credentials: 'include'
        });
        if (response.ok) {
          alert('Бронирование успешно отменено!');
          fetchBookings(); // Перезагружаем актуальный список с сервера
        } else {
          const data = await response.json();
          alert(data.error || 'Не удалось отменить бронирование');
        }
      } catch (err) {
        alert('Ошибка соединения с сервером');
      }
    }
  };

  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Загрузка ваших бронирований...</div>;

  return (
    <div className="bookings-page-container">
      <h1 className="page-main-title">Мои бронирования</h1>

      {bookings.length === 0 ? (
        <div className="empty-bookings-box animate-fade">
          <p>Никаких номеров не забронировано</p>
          <button className="btn btn-search-trigger" onClick={() => setCurrentPage('search')}>
            🔍 Найти отели
          </button>
        </div>
      ) : (
        <div className="bookings-list-grid">
          {bookings.map((booking) => {
            const nights = calculateNights(booking.checkIn, booking.checkOut);
            const totalCost = nights * booking.pricePerNight;

            return (
              <div key={booking.id} className="booking-three-parts-card animate-fade">
                <div className="card-part-left">
                  <div className="booking-hotel-badge-rating">⭐ {booking.rating}</div>
                  <div className="booking-hotel-image-wrapper"><img src={booking.photo} alt={booking.hotelName} /></div>
                  <div className="booking-hotel-info-block">
                    <h3 className="b-hotel-title">{booking.hotelName}</h3>
                    <p className="b-hotel-geo">📍 {booking.country}, {booking.city}, {booking.address}</p>
                    <p className="b-hotel-desc">{booking.description}</p>
                    <p className="b-hotel-phone">📞 {booking.phone}</p>
                  </div>
                </div>

                <div className="card-part-center">
                  <h4>🛏️ Параметры размещения</h4>
                  <div className="room-spec-item"><span className="spec-label">Номер:</span><span className="spec-value font-highlight">{booking.roomName}</span></div>
                  <div className="room-spec-item"><span className="spec-label">Кол-во гостей:</span><span className="spec-value">{booking.guestsCount} чел.</span></div>
                  <div className="room-spec-item"><span className="spec-label">Заезд:</span><span className="spec-value">{new Date(booking.checkIn).toLocaleDateString('ru-RU')}</span></div>
                  <div className="room-spec-item"><span className="spec-label">Выезд:</span><span className="spec-value">{new Date(booking.checkOut).toLocaleDateString('ru-RU')}</span></div>
                </div>

                <div className="card-part-right">
                  <div className="financials-block">
                    <div className="b-total-cost">{totalCost.toLocaleString('ru-RU')} ₽</div>
                    <div className="b-sub-price">Плата за ночь: {booking.pricePerNight} ₽</div>
                  </div>
                  <div className={`booking-status-badge status-${booking.status === 'Отменено' ? 'danger' : 'success'}`}>
                    {booking.status}
                  </div>
                  {booking.status !== 'Отменено' && (
                    <button className="btn btn-danger-action" onClick={() => handleCancel(booking.id)}>Отменить бронь</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}