// src/components/modals/BookingModal.jsx
import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../App';

export default function BookingModal({ isOpen, onClose, user, bookingTarget, onAuthRequired, onSuccess }) {
  const [step, setStep] = useState(1); // 1=даты, 2=подтверждение, 3=успех
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({ checkIn: '', checkOut: '', guestsCount: 1, specialRequests: '' });
  const [nights, setNights] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Подгружаем комнаты отеля, если передан отель без конкретной комнаты
  useEffect(() => {
    if (!isOpen) { setStep(1); setError(''); setSelectedRoom(null); return; }
    if (bookingTarget?.roomId) {
      // Конкретная комната — подгружаем её данные
      if (bookingTarget.hotel?.id) {
        fetch(`${API_BASE}/hotels/${bookingTarget.hotel.id}/rooms`, { credentials: 'include' })
          .then(r => r.json())
          .then(data => {
            const room = data.find(r => r.id === bookingTarget.roomId);
            setSelectedRoom(room || null);
            setRooms(data);
          })
          .catch(() => {});
      }
    } else if (bookingTarget?.hotel?.id) {
      // Только отель — покажем выбор номеров
      fetch(`${API_BASE}/hotels/${bookingTarget.hotel.id}/rooms`, { credentials: 'include' })
        .then(r => r.json())
        .then(data => setRooms(data.filter(r => r.available)))
        .catch(() => {});
    }
  }, [isOpen, bookingTarget]);

  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const d = Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / 86400000);
      setNights(d > 0 ? d : 0);
    } else {
      setNights(0);
    }
  }, [formData.checkIn, formData.checkOut]);

  if (!isOpen) return null;

  const totalPrice = nights * (selectedRoom?.pricePerNight || 0);
  const hotel = bookingTarget?.hotel;

  const handleSubmit = async () => {
    if (!user) { onAuthRequired(); return; }
    if (!selectedRoom) { setError('Выберите номер'); return; }
    if (!formData.checkIn || !formData.checkOut) { setError('Укажите даты заезда и выезда'); return; }
    if (nights <= 0) { setError('Дата выезда должна быть позже даты заезда'); return; }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          booking: {
            room_id: selectedRoom.id,
            check_in_date: formData.checkIn,
            check_out_date: formData.checkOut,
            guests_count: formData.guestsCount,
            special_requests: formData.specialRequests
          }
        })
      });
      const data = await res.json();
      if (res.ok) {
        setStep(3);
      } else {
        setError(data.error || data.errors?.join(', ') || 'Ошибка бронирования');
      }
    } catch {
      setError('Ошибка сети. Проверьте соединение.');
    } finally {
      setLoading(false);
    }
  };

  const ROOM_TYPE_LABELS = { single: 'Одноместный', double: 'Двухместный', suite: 'Люкс' };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window modal-booking" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>

        {step === 1 && (
          <div className="modal-content">
            <h2>Бронирование {hotel ? `— ${hotel.name}` : ''}</h2>
            {error && <div className="form-error">{error}</div>}

            {/* Выбор номера (если нет предвыбранного) */}
            {!bookingTarget?.roomId && rooms.length > 0 && (
              <div className="room-select-section">
                <h4>Выберите номер</h4>
                <div className="room-select-grid">
                  {rooms.map(r => (
                    <div
                      key={r.id}
                      className={`room-select-card ${selectedRoom?.id === r.id ? 'selected' : ''}`}
                      onClick={() => setSelectedRoom(r)}
                    >
                      <strong>{ROOM_TYPE_LABELS[r.roomType] || r.roomType} №{r.roomNumber}</strong>
                      <span>👥 {r.capacity} чел.</span>
                      <span>💰 {r.pricePerNight?.toLocaleString('ru-RU')} ₽/ночь</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedRoom && (
              <div className="selected-room-info">
                <span>✅ Выбран: {ROOM_TYPE_LABELS[selectedRoom.roomType] || selectedRoom.roomType} №{selectedRoom.roomNumber} — {selectedRoom.pricePerNight?.toLocaleString('ru-RU')} ₽/ночь</span>
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label>Дата заезда</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.checkIn}
                  onChange={e => setFormData({ ...formData, checkIn: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Дата выезда</label>
                <input
                  type="date"
                  min={formData.checkIn || new Date().toISOString().split('T')[0]}
                  value={formData.checkOut}
                  onChange={e => setFormData({ ...formData, checkOut: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Гостей</label>
                <select value={formData.guestsCount} onChange={e => setFormData({ ...formData, guestsCount: +e.target.value })}>
                  {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} чел.</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>ФИО гостя</label>
                <input type="text" value={user ? user.fullName : 'Не авторизован'} readOnly className="readonly-input" />
              </div>
              <div className="form-group" style={{ flex: '1 1 100%' }}>
                <label>Особые пожелания (необязательно)</label>
                <textarea
                  placeholder="Поздний заезд, детская кроватка..."
                  value={formData.specialRequests}
                  onChange={e => setFormData({ ...formData, specialRequests: e.target.value })}
                  rows={2}
                />
              </div>
            </div>

            {nights > 0 && selectedRoom && (
              <div className="booking-summary-box">
                <p>Длительность: <strong>{nights} ночей</strong></p>
                <p>Цена за ночь: <strong>{selectedRoom.pricePerNight?.toLocaleString('ru-RU')} ₽</strong></p>
                <hr />
                <p className="total-price">Итого: <span>{totalPrice.toLocaleString('ru-RU')} ₽</span></p>
              </div>
            )}

            {!user ? (
              <button className="btn btn-submit" onClick={onAuthRequired}>
                Войдите для бронирования
              </button>
            ) : (
              <button
                className="btn btn-submit"
                onClick={() => { setError(''); setStep(2); }}
                disabled={!selectedRoom || nights <= 0}
              >
                Далее — Подтвердить →
              </button>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="modal-content">
            <h2>Подтверждение брони</h2>
            {error && <div className="form-error">{error}</div>}
            <div className="confirm-summary">
              <div className="confirm-row"><span>Отель:</span><strong>{hotel?.name}</strong></div>
              <div className="confirm-row"><span>Номер:</span><strong>{ROOM_TYPE_LABELS[selectedRoom?.roomType]} №{selectedRoom?.roomNumber}</strong></div>
              <div className="confirm-row"><span>Гость:</span><strong>{user?.fullName}</strong></div>
              <div className="confirm-row"><span>Заезд:</span><strong>{new Date(formData.checkIn).toLocaleDateString('ru-RU')}</strong></div>
              <div className="confirm-row"><span>Выезд:</span><strong>{new Date(formData.checkOut).toLocaleDateString('ru-RU')}</strong></div>
              <div className="confirm-row"><span>Ночей:</span><strong>{nights}</strong></div>
              <div className="confirm-row"><span>Гостей:</span><strong>{formData.guestsCount}</strong></div>
              {formData.specialRequests && <div className="confirm-row"><span>Пожелания:</span><strong>{formData.specialRequests}</strong></div>}
              <div className="confirm-row total-row"><span>К оплате:</span><strong>{totalPrice.toLocaleString('ru-RU')} ₽</strong></div>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setStep(1)}>← Назад</button>
              <button className="btn btn-submit" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Оформляем...' : '✅ Подтвердить бронь'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="modal-content success-step">
            <div className="success-icon">🎉</div>
            <h2>Бронь оформлена!</h2>
            <p>Ваша заявка принята и ожидает подтверждения.</p>
            <p>Вы можете оплатить её в разделе «Мои бронирования».</p>
            <div className="form-actions">
              <button className="btn btn-submit" onClick={() => { onClose(); onSuccess(); }}>
                Перейти к бронированиям →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}