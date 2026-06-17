import React from 'react';

export default function HotelCard({ hotel, onOpenPage, onBookRoom }) {
  return (
    <div className="hotel-card animate-fade">
      {/* Рейтинг отеля в правом верхнем углу */}
      <div className="hotel-badge-rating">⭐ {hotel.rating?.toFixed(1)}</div>

      {/* Фото отеля слева */}
      <div className="hotel-card-image-box" onClick={onOpenPage} style={{ cursor: onOpenPage ? 'pointer' : 'default' }}>
        <img src={hotel.photo} alt={hotel.name} />
      </div>

      {/* Контентная часть справа от фото */}
      <div className="hotel-card-info">
        <div className="hotel-main-details">
          <h3 className="hotel-title-name" onClick={onOpenPage} style={{ cursor: onOpenPage ? 'pointer' : 'default' }}>
            {hotel.name}
          </h3>
          <p className="hotel-geo-location">📍 {hotel.country}, {hotel.city}, {hotel.address}</p>
          <p className="hotel-short-description">{hotel.description}</p>
          <p className="hotel-phone-number">📞 Тел: <span>{hotel.phone}</span></p>
        </div>

        {/* Нижний уровень, очерченный лёгкой линией */}
        <div className="hotel-card-bottom-bar">
          <div className="available-rooms-count">
            Доступно номеров: <strong>{hotel.availableRooms}</strong>
          </div>
          <div className="hotel-card-actions">
            {onOpenPage && (
              <button className="btn btn-ghost" onClick={onOpenPage}>Подробнее</button>
            )}
            <button className="btn btn-accent btn-show-rooms" onClick={onOpenPage || onBookRoom}>
              Показать все номера
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}