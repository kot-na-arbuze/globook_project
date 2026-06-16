import React from 'react';

export default function HotelCard({ hotel }) {
  return (
    <div className="hotel-card animate-fade">
      {/* Рейтинг отеля в правом верхнем углу */}
      <div className="hotel-badge-rating">
        ⭐ {hotel.rating.toFixed(1)}
      </div>

      {/* Фото отеля слева */}
      <div className="hotel-card-image-box">
        <img src={hotel.photo || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'} alt={hotel.name} />
      </div>

      {/* Контентная часть справа от фото */}
      <div className="hotel-card-info">
        <div className="hotel-main-details">
          <h3 className="hotel-title-name">{hotel.name}</h3>
          <p className="hotel-geo-location">📍 {hotel.country}, {hotel.city}, {hotel.address}</p>
          <p className="hotel-short-description">{hotel.description}</p>
          <p className="hotel-phone-number">📞 Тел: <span>{hotel.phone}</span></p>
        </div>

        {/* Нижний уровень, очерченный легкой линией */}
        <div className="hotel-card-bottom-bar">
          <div className="available-rooms-count">
            Доступно номеров: <strong>{hotel.availableRooms}</strong>
          </div>
          <button className="btn btn-show-rooms" onClick={() => alert(`Открываем номера отеля ${hotel.name}`)}>
            Показать все номера
          </button>
        </div>
      </div>
    </div>
  );
}