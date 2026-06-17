// src/components/modals/BookingModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { API_BASE } from '../../App';

const ROOM_TYPE_LABELS = { single: 'Одноместный', double: 'Двухместный', suite: 'Люкс' };

/* Поле ввода с подсказками доступных в системе вариантов */
function AutocompleteField({ label, value, onChange, options, placeholder, disabled }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const filtered = (options || []).filter(o =>
    o.toLowerCase().includes((value || '').toLowerCase()) && o.toLowerCase() !== (value || '').toLowerCase()
  ).slice(0, 6);

  return (
    <div className="form-group autocomplete-wrap" ref={wrapRef}>
      <label>{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <div className="autocomplete-list">
          {filtered.map(opt => (
            <div
              key={opt}
              className="autocomplete-item"
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BookingModal({ isOpen, onClose, user, bookingTarget, onAuthRequired, onSuccess }) {
  const [step, setStep] = useState(1); // 1=поиск/выбор, 2=подтверждение, 3=успех
  const [allHotels, setAllHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    country: '', city: '', address: '', roomQuery: '',
    checkIn: '', checkOut: '', guestsCount: 1
  });
  const [nights, setNights] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(false);

  // Загружаем справочник отелей для подсказок (страна/город/адрес) при открытии окна
  useEffect(() => {
    if (!isOpen) return;
    fetch(`${API_BASE}/hotels/search`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setAllHotels(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [isOpen]);

  // Сброс состояния и предзаполнение из bookingTarget (если выбрали отель/номер на странице поиска)
  useEffect(() => {
    if (!isOpen) {
      setStep(1); setError(''); setSelectedRoom(null); setSelectedHotel(null);
      setFormData({ country: '', city: '', address: '', roomQuery: '', checkIn: '', checkOut: '', guestsCount: 1 });
      return;
    }

    if (bookingTarget?.hotel) {
      const hotel = bookingTarget.hotel;
      setSelectedHotel(hotel);
      setFormData(prev => ({
        ...prev,
        country: hotel.country || '',
        city: hotel.city || '',
        address: hotel.address || ''
      }));

      setRoomsLoading(true);
      fetch(`${API_BASE}/hotels/${hotel.id}/rooms`, { credentials: 'include' })
        .then(r => r.json())
        .then(data => {
          const list = Array.isArray(data) ? data : [];
          setRooms(list);
          if (bookingTarget.roomId) {
            const room = list.find(r => r.id === bookingTarget.roomId);
            setSelectedRoom(room || null);
          }
        })
        .catch(() => {})
        .finally(() => setRoomsLoading(false));
    }
  }, [isOpen, bookingTarget]);

  // Подгружаем номера, когда пользователь выбрал отель вручную через автокомплит
  useEffect(() => {
    if (!selectedHotel) return;
    setRoomsLoading(true);
    fetch(`${API_BASE}/hotels/${selectedHotel.id}/rooms`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setRooms(Array.isArray(data) ? data.filter(r => r.available) : []))
      .catch(() => {})
      .finally(() => setRoomsLoading(false));
  }, [selectedHotel]);

  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const d = Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / 86400000);
      setNights(d > 0 ? d : 0);
    } else {
      setNights(0);
    }
  }, [formData.checkIn, formData.checkOut]);

  if (!isOpen) return null;

  // Уникальные варианты для подсказок, собранные из справочника отелей системы
  const countryOptions = [...new Set(allHotels.map(h => h.country).filter(Boolean))];
  const cityOptions = [...new Set(allHotels
    .filter(h => !formData.country || h.country === formData.country)
    .map(h => h.city).filter(Boolean))];
  const addressOptions = [...new Set(allHotels
    .filter(h => !formData.city || h.city === formData.city)
    .map(h => h.address).filter(Boolean))];

  // Отели, подходящие под введённые страну/город/адрес
  const matchingHotels = allHotels.filter(h =>
    (!formData.country || h.country.toLowerCase().includes(formData.country.toLowerCase())) &&
    (!formData.city || h.city.toLowerCase().includes(formData.city.toLowerCase())) &&
    (!formData.address || h.address.toLowerCase().includes(formData.address.toLowerCase()))
  );

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSelectedRoom(null);
    // Если введённое значение точно совпадает с конкретным отелем — выбираем его автоматически
    const updated = { ...formData, [field]: value };
    const exact = allHotels.find(h =>
      (updated.address ? h.address === updated.address : true) &&
      (updated.city ? h.city === updated.city : true) &&
      (updated.country ? h.country === updated.country : true) &&
      (updated.address || updated.city)
    );
    if (exact && (field === 'address' || (field === 'city' && updated.address === ''))) {
      setSelectedHotel(exact);
    } else if (!value) {
      setSelectedHotel(null);
      setRooms([]);
    }
  };

  const roomOptions = rooms.map(r => `№${r.roomNumber} — ${ROOM_TYPE_LABELS[r.roomType] || r.roomType}`);

  const totalPrice = nights * (selectedRoom?.pricePerNight || 0);

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
            guests_count: formData.guestsCount
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window modal-booking" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>

        {step === 1 && (
          <div className="modal-content">
            <h2>Бронирование{selectedHotel ? ` — ${selectedHotel.name}` : ''}</h2>
            {error && <div className="form-error">{error}</div>}

            <div className="form-grid">
              <AutocompleteField
                label="Страна"
                value={formData.country}
                onChange={v => handleLocationChange('country', v)}
                options={countryOptions}
                placeholder="Россия"
              />
              <AutocompleteField
                label="Город"
                value={formData.city}
                onChange={v => handleLocationChange('city', v)}
                options={cityOptions}
                placeholder="Москва"
              />
              <AutocompleteField
                label="Адрес"
                value={formData.address}
                onChange={v => handleLocationChange('address', v)}
                options={addressOptions}
                placeholder="Улица, дом"
              />
            </div>

            {/* Если по адресу/городу нашлось несколько отелей — даём выбрать конкретный */}
            {!selectedHotel && matchingHotels.length > 0 && (formData.country || formData.city || formData.address) && (
              <div className="room-select-section">
                <h4>Выберите отель</h4>
                <div className="room-select-grid">
                  {matchingHotels.slice(0, 6).map(h => (
                    <div
                      key={h.id}
                      className="room-select-card"
                      onClick={() => {
                        setSelectedHotel(h);
                        setFormData(prev => ({ ...prev, country: h.country, city: h.city, address: h.address }));
                      }}
                    >
                      <strong>{h.name}</strong>
                      <span>📍 {h.city}, {h.address}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedHotel && (
              <div className="form-group autocomplete-wrap">
                <label>Номер</label>
                {roomsLoading ? (
                  <input type="text" disabled placeholder="Загружаем номера..." />
                ) : (
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
                    {rooms.length === 0 && (
                      <div className="empty-rooms" style={{ gridColumn: '1/-1', padding: '16px' }}>
                        Нет доступных номеров в этом отеле
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {selectedRoom && (
              <div className="selected-room-info">
                ✅ Выбран: {ROOM_TYPE_LABELS[selectedRoom.roomType] || selectedRoom.roomType} №{selectedRoom.roomNumber} — {selectedRoom.pricePerNight?.toLocaleString('ru-RU')} ₽/ночь
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label>Заезд</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.checkIn}
                  onChange={e => setFormData({ ...formData, checkIn: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Выезд</label>
                <input
                  type="date"
                  min={formData.checkIn || new Date().toISOString().split('T')[0]}
                  value={formData.checkOut}
                  onChange={e => setFormData({ ...formData, checkOut: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Количество гостей</label>
                <select value={formData.guestsCount} onChange={e => setFormData({ ...formData, guestsCount: +e.target.value })}>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n} чел.</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>ФИО гостя</label>
                <input type="text" value={user ? user.fullName : 'Войдите в аккаунт'} readOnly className="readonly-input" />
              </div>
              <div className="form-group" style={{ flex: '1 1 100%' }}>
                <label>Телефон гостя</label>
                <input type="text" value={user ? user.phone : 'Войдите в аккаунт'} readOnly className="readonly-input" />
              </div>
            </div>

            {nights > 0 && selectedRoom && (
              <div className="booking-summary-box">
                <p>Количество ночей: <strong>{nights}</strong></p>
                <p>Цена за ночь: <strong>{selectedRoom.pricePerNight?.toLocaleString('ru-RU')} ₽</strong></p>
                <hr />
                <p className="total-price">Итоговая цена: <span>{totalPrice.toLocaleString('ru-RU')} ₽</span></p>
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
                Далее — подтвердить →
              </button>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="modal-content">
            <h2>Подтверждение брони</h2>
            {error && <div className="form-error">{error}</div>}
            <div className="confirm-summary">
              <div className="confirm-row"><span>Отель:</span><strong>{selectedHotel?.name}</strong></div>
              <div className="confirm-row"><span>Номер:</span><strong>{ROOM_TYPE_LABELS[selectedRoom?.roomType]} №{selectedRoom?.roomNumber}</strong></div>
              <div className="confirm-row"><span>Гость:</span><strong>{user?.fullName}</strong></div>
              <div className="confirm-row"><span>Телефон:</span><strong>{user?.phone}</strong></div>
              <div className="confirm-row"><span>Заезд:</span><strong>{new Date(formData.checkIn).toLocaleDateString('ru-RU')}</strong></div>
              <div className="confirm-row"><span>Выезд:</span><strong>{new Date(formData.checkOut).toLocaleDateString('ru-RU')}</strong></div>
              <div className="confirm-row"><span>Ночей:</span><strong>{nights}</strong></div>
              <div className="confirm-row"><span>Гостей:</span><strong>{formData.guestsCount}</strong></div>
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