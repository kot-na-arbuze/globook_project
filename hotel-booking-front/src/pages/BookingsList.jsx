import React, { useState } from 'react';

// Тестовые данные забронированных номеров
const mockBookings = [
  {
    id: 'b-9021',
    hotelName: 'Метрополь Премьер',
    country: 'Россия', city: 'Москва', address: 'Театральный проезд, д. 2',
    description: 'Легендарный отель с вековой историей в шаговой доступностью до Красной площади.',
    phone: '+7 (495) 225-88-88',
    rating: 9.2,
    photo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500',
    // Данные номера
    roomName: 'Люкс с видом на исторический центр',
    guestsCount: 2,
    checkIn: '2026-07-10',
    checkOut: '2026-07-15',
    pricePerNight: 8500,
    status: 'Ожидает подтверждения'
  }
];

export default function BookingsList({ setCurrentPage }) {
  const [bookings, setBookings] = useState(mockBookings);

  // Функция расчета разницы дней между датами
  const calculateNights = (inDate, outDate) => {
    const start = new Date(inDate);
    const end = new Date(outDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleCancel = (id) => {
    if (window.confirm('Вы уверены, что хотите отменить это бронирование?')) {
      setBookings(bookings.filter(b => b.id !== id));
    }
  };

  return (
    <div className="bookings-page-container">
      {/* Заголовок присутствует всегда */}
      <h1 className="page-main-title">Мои бронирования</h1>

      {bookings.length === 0 ? (
        /* Состояние: Пусто */
        <div className="empty-bookings-box animate-fade">
          <p>Никаких номеров не забронировано</p>
          <button className="btn btn-search-trigger" onClick={() => setCurrentPage('search')}>
            🔍 Найти отели
          </button>
        </div>
      ) : (
        /* Состояние: Есть бронирования */
        <div className="bookings-list-grid">
          {bookings.map((booking) => {
            const nights = calculateNights(booking.checkIn, booking.checkOut);
            const totalCost = nights * booking.pricePerNight;

            return (
              <div key={booking.id} className="booking-three-parts-card animate-fade">
                
                {/* ЛЕВАЯ ЧАСТЬ: Описание отеля */}
                <div className="card-part-left">
                  <div className="booking-hotel-badge-rating">⭐ {booking.rating.toFixed(1)}</div>
                  <div className="booking-hotel-image-wrapper">
                    <img src={booking.photo} alt={booking.hotelName} />
                  </div>
                  <div className="booking-hotel-info-block">
                    <h3 className="b-hotel-title">{booking.hotelName}</h3>
                    <p className="b-hotel-geo">📍 {booking.country}, {booking.city}, {booking.address}</p>
                    <p className="b-hotel-desc">{booking.description}</p>
                    <p className="b-hotel-phone">📞 {booking.phone}</p>
                  </div>
                </div>

                {/* ЦЕНТРАЛЬНАЯ ЧАСТЬ: Описание номера */}
                <div className="card-part-center">
                  <h4>🛏️ Параметры размещения</h4>
                  <div className="room-spec-item">
                    <span className="spec-label">Номер:</span>
                    <span className="spec-value font-highlight">{booking.roomName}</span>
                  </div>
                  <div className="room-spec-item">
                    <span className="spec-label">Кол-во гостей:</span>
                    <span className="spec-value">{booking.guestsCount} чел.</span>
                  </div>
                  <div className="room-spec-item">
                    <span className="spec-label">Заезд:</span>
                    <span className="spec-value">{new Date(booking.checkIn).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="room-spec-item">
                    <span className="spec-label">Выезд:</span>
                    <span className="spec-value">{new Date(booking.checkOut).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="room-spec-item">
                    <span className="spec-label">Длительность:</span>
                    <span className="spec-value font-highlight">{nights} ночей (-и)</span>
                  </div>
                </div>

                {/* ПРАВАЯ ЧАСТЬ: Финансы и управление */}
                <div className="card-part-right">
                  <div className="financials-block">
                    <div className="b-total-cost">{totalCost.toLocaleString('ru-RU')} ₽</div>
                    <div className="b-sub-price">Плата за ночь: {booking.pricePerNight} ₽</div>
                    <div className="b-sub-nights">Количество ночей: {nights}</div>
                  </div>

                  <div className="booking-status-badge">
                    {booking.status}
                  </div>

                  <button className="btn btn-danger-action" onClick={() => handleCancel(booking.id)}>
                    Отменить бронь
                  </button>
                </div>

              </div>
            );
          })}
          
          {/* Инженерная кнопка симуляции для проверки двух состояний страницы */}
          <button style={{marginTop: '20px', padding: '4px 10px', fontSize: '11px', opacity: 0.5}} onClick={() => setBookings([])}>
            Стереть все бронирования (Тест пустого экрана)
          </button>
        </div>
      )}
    </div>
  );
}