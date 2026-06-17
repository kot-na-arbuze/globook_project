// src/pages/HotelPage.jsx
import React, { useState, useEffect } from 'react';
import { API_BASE } from '../App';

const ROOM_TYPE_LABELS = { single: 'Одноместный', double: 'Двухместный', suite: 'Люкс' };

export default function HotelPage({ hotel: initialHotel, user, openBooking, setCurrentPage }) {
  const [hotel, setHotel] = useState(initialHotel);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  useEffect(() => {
    if (!hotel?.id) return;
    setLoading(true);
    fetch(`${API_BASE}/hotels/${hotel.id}`)
      .then(r => r.json())
      .then(data => {
        setHotel(data);
        setRooms(data.rooms || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [hotel?.id]);

  if (!hotel) {
    return (
      <div className="centered-message">
        <p>Отель не найден</p>
        <button className="btn btn-accent" onClick={() => setCurrentPage('search')}>← К поиску</button>
      </div>
    );
  }

  const filteredRooms = rooms.filter(r => !filterType || r.roomType === filterType);

  const canManageRooms = user?.permissions?.includes('create_room') || user?.permissions?.includes('delete_room');

  return (
    <div className="hotel-page">
      {/* HERO ОТЕЛЯ */}
      <div className="hotel-hero">
        <img src={hotel.photo} alt={hotel.name} className="hotel-hero-img" />
        <div className="hotel-hero-overlay">
          <div className="container">
            <button className="btn-back" onClick={() => setCurrentPage('search')}>← Назад к поиску</button>
            <div className="hotel-hero-badge">⭐ {hotel.rating?.toFixed(1)}</div>
            <h1 className="hotel-hero-title">{hotel.name}</h1>
            <p className="hotel-hero-geo">📍 {hotel.country}, {hotel.city}, {hotel.address}</p>
          </div>
        </div>
      </div>

      <div className="container hotel-page-body">
        {/* ИНФО БЛОК */}
        <div className="hotel-info-grid">
          <div className="hotel-info-main">
            <h2>Об отеле</h2>
            <p className="hotel-full-desc">{hotel.description}</p>
            <div className="hotel-contacts">
              <span>📞 {hotel.phone}</span>
              <span>📍 {hotel.address}</span>
            </div>
          </div>
          <div className="hotel-info-sidebar">
            <div className="hotel-summary-card">
              <div className="summary-rating">
                <span className="rating-big">⭐ {hotel.rating?.toFixed(1)}</span>
                <span className="rating-label">Рейтинг отеля</span>
              </div>
              <div className="summary-rooms">
                <span className="rooms-count-big">{hotel.availableRooms}</span>
                <span className="rooms-label">доступных номеров</span>
              </div>
              <button className="btn btn-accent btn-full" onClick={() => {
                const section = document.getElementById('rooms-section');
                section?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Выбрать номер
              </button>
            </div>
          </div>
        </div>

        {/* НОМЕРА */}
        <div id="rooms-section" className="rooms-section">
          <div className="rooms-header">
            <h2>Доступные номера</h2>
            <div className="rooms-filters-row">
              <div className="rooms-filter-dates">
                <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} placeholder="Заезд" />
                <span>—</span>
                <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} placeholder="Выезд" />
              </div>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} className="rooms-type-filter">
                <option value="">Все типы</option>
                <option value="single">Одноместный</option>
                <option value="double">Двухместный</option>
                <option value="suite">Люкс</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-spinner">Загружаем номера...</div>
          ) : (
            <div className="rooms-grid">
              {filteredRooms.map(room => (
                <RoomCard
                  key={room.id}
                  room={room}
                  hotel={hotel}
                  user={user}
                  openBooking={openBooking}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  canManage={canManageRooms}
                />
              ))}
              {filteredRooms.length === 0 && (
                <div className="empty-rooms">Нет доступных номеров по выбранным фильтрам</div>
              )}
            </div>
          )}

          {/* Добавление номера (менеджер/админ) */}
          {canManageRooms && (
            <AddRoomForm hotelId={hotel.id} onRoomAdded={(room) => setRooms(prev => [...prev, room])} />
          )}
        </div>
      </div>
    </div>
  );
}

function RoomCard({ room, hotel, user, openBooking, checkIn, checkOut, canManage }) {
  const [deleting, setDeleting] = useState(false);

  const nights = checkIn && checkOut
    ? Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : 0;

  const handleDelete = async () => {
    if (!window.confirm('Удалить номер?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/hotels/${hotel.id}/rooms/${room.id}`, {
        method: 'DELETE', credentials: 'include'
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert('Ошибка при удалении номера');
        setDeleting(false);
      }
    } catch { setDeleting(false); }
  };

  return (
    <div className={`room-card ${!room.available ? 'room-unavailable' : ''}`}>
      <div className="room-card-header">
        <div className="room-type-badge">{ROOM_TYPE_LABELS[room.roomType] || room.roomType}</div>
        <div className="room-number">№ {room.roomNumber}</div>
      </div>
      <div className="room-card-body">
        <div className="room-specs">
          <span>👥 {room.capacity} чел.</span>
          <span>💰 {room.pricePerNight?.toLocaleString('ru-RU')} ₽/ночь</span>
        </div>
        {room.amenities?.length > 0 && (
          <div className="room-amenities">
            {room.amenities.map(a => <span key={a} className="amenity-tag">{a}</span>)}
          </div>
        )}
        {nights > 0 && (
          <div className="room-total-preview">
            Итого за {nights} ночей: <strong>{(nights * room.pricePerNight).toLocaleString('ru-RU')} ₽</strong>
          </div>
        )}
      </div>
      <div className="room-card-footer">
        {room.available ? (
          <button
            className="btn btn-accent btn-book-room"
            onClick={() => openBooking(room.id, hotel)}
          >
            Забронировать
          </button>
        ) : (
          <span className="room-busy-label">Занят</span>
        )}
        {canManage && (
          <button className="btn btn-danger-sm" onClick={handleDelete} disabled={deleting}>
            {deleting ? '...' : '🗑'}
          </button>
        )}
      </div>
    </div>
  );
}

function AddRoomForm({ hotelId, onRoomAdded }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    room_number: '', room_type: 'double', capacity: 2, price_per_night: 5000, amenities: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/hotels/${hotelId}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ room: form })
      });
      const data = await res.json();
      if (res.ok) {
        onRoomAdded(data);
        setOpen(false);
        setForm({ room_number: '', room_type: 'double', capacity: 2, price_per_night: 5000, amenities: '' });
      } else {
        setError(data.errors?.join(', ') || 'Ошибка');
      }
    } catch { setError('Ошибка сети'); }
    setSaving(false);
  };

  if (!open) return (
    <button className="btn btn-add-room" onClick={() => setOpen(true)}>+ Добавить номер</button>
  );

  return (
    <div className="add-room-form">
      <h4>Добавить новый номер</h4>
      {error && <div className="form-error">{error}</div>}
      <div className="form-row">
        <div className="form-group">
          <label>Номер комнаты</label>
          <input value={form.room_number} onChange={e => setForm({ ...form, room_number: e.target.value })} placeholder="101" />
        </div>
        <div className="form-group">
          <label>Тип</label>
          <select value={form.room_type} onChange={e => setForm({ ...form, room_type: e.target.value })}>
            <option value="single">Одноместный</option>
            <option value="double">Двухместный</option>
            <option value="suite">Люкс</option>
          </select>
        </div>
        <div className="form-group">
          <label>Вместимость</label>
          <input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: +e.target.value })} min={1} max={10} />
        </div>
        <div className="form-group">
          <label>Цена/ночь (₽)</label>
          <input type="number" value={form.price_per_night} onChange={e => setForm({ ...form, price_per_night: +e.target.value })} />
        </div>
        <div className="form-group" style={{ flex: '1 1 100%' }}>
          <label>Удобства (через запятую)</label>
          <input value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })} placeholder="Wi-Fi, Кондиционер, Завтрак" />
        </div>
      </div>
      <div className="form-actions">
        <button className="btn btn-accent" onClick={handleSave} disabled={saving}>{saving ? 'Сохранение...' : 'Сохранить'}</button>
        <button className="btn btn-ghost" onClick={() => setOpen(false)}>Отмена</button>
      </div>
    </div>
  );
}