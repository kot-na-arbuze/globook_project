import React, { useState, useEffect } from 'react';
import { API_BASE } from '../App';

export default function BookingModal({ isOpen, onClose, user, targetRoomId = "Вставьте_UUID_Комнаты_Сюда" }) {
  const [bookingData, setBookingData] = useState({
    checkIn: '', checkOut: ''
  });
  const [nights, setNights] = useState(0);
  const [error, setError] = useState('');
  const pricePerNight = 4500;

  useEffect(() => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const start = new Date(bookingData.checkIn);
      const end = new Date(bookingData.checkOut);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setNights(days > 0 ? days : 0);
    } else {
      setNights(0);
    }
  }, [bookingData.checkIn, bookingData.checkOut]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Вы должны войти в систему для бронирования номера!');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          booking: {
            room_id: targetRoomId, // Передаем UUID комнаты на бэкенд
            check_in_date: bookingData.checkIn,
            check_out_date: bookingData.checkOut
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Заказ успешно оформлен на бэкенде!');
        onClose();
      } else {
        setError(data.error || 'Ошибка при бронировании');
      }
    } catch (err) {
      setError('Ошибка сети. Сервер недоступен.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <div className="modal-content">
          <h2>Оформление бронирования</h2>
          {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Дата заезда</label>
                <input type="date" required onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Дата выезда</label>
                <input type="date" required onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})} />
              </div>
              <div className="form-group">
                <label>ФИО гостя</label>
                <input type="text" value={user ? user.fullName : 'Не авторизован'} readOnly className="readonly-input" />
              </div>
            </div>

            <div className="booking-summary-box">
              <p>Длительность: <strong>{nights} ночей</strong></p>
              <hr />
              <p className="total-price">Итого: <span>{nights * pricePerNight} ₽</span></p>
            </div>

            <button type="submit" className="btn btn-submit" disabled={!user}>
              Осуществить заказ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}