import React, { useState } from 'react';

export default function SearchFilters({ onSearch }) {
  const [filters, setFilters] = useState({
    country: '', city: '', address: '', roomName: '',
    checkIn: '', checkOut: '', rating: '',
    roomType: '', priceFrom: '', priceTo: '',
    amenities: []
  });

  const availableAmenities = ['Wi-Fi', 'Бассейн', 'Парковка', 'Завтрак', 'Кондиционер'];

  const handleAmenityChange = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <div className="filter-panel">
      <h3>Фильтры поиска</h3>
      <form onSubmit={handleSubmit}>

        <div className="filter-section">
          <h4>📍 Местоположение и номер</h4>
          <div className="filter-group">
            <label>Страна</label>
            <input type="text" placeholder="Россия" value={filters.country} onChange={e => setFilters({ ...filters, country: e.target.value })} />
          </div>
          <div className="filter-group">
            <label>Город</label>
            <input type="text" placeholder="Москва" value={filters.city} onChange={e => setFilters({ ...filters, city: e.target.value })} />
          </div>
          <div className="filter-group">
            <label>Адрес</label>
            <input type="text" placeholder="Улица, дом" value={filters.address} onChange={e => setFilters({ ...filters, address: e.target.value })} />
          </div>
          <div className="filter-group">
            <label>Название / № номера</label>
            <input type="text" placeholder="204 или Люкс" value={filters.roomName} onChange={e => setFilters({ ...filters, roomName: e.target.value })} />
          </div>
        </div>

        <div className="filter-section">
          <h4>📅 Даты и рейтинг</h4>
          <div className="filter-group">
            <label>Заезд</label>
            <input type="date" value={filters.checkIn} onChange={e => setFilters({ ...filters, checkIn: e.target.value })} />
          </div>
          <div className="filter-group">
            <label>Выезд</label>
            <input type="date" value={filters.checkOut} onChange={e => setFilters({ ...filters, checkOut: e.target.value })} />
          </div>
          <div className="filter-group">
            <label>Минимальный рейтинг ({(filters.rating || 1).toFixed ? (filters.rating || 1).toFixed(1) : filters.rating || '1.0'})</label>
            <input type="range" min="1" max="10" step="0.1" value={filters.rating || 1} onChange={e => setFilters({ ...filters, rating: parseFloat(e.target.value) })} />
          </div>
        </div>

        <div className="filter-section">
          <h4>🏨 Параметры номера</h4>
          <div className="filter-group">
            <label>Тип номера</label>
            <select value={filters.roomType} onChange={e => setFilters({ ...filters, roomType: e.target.value })}>
              <option value="">Любой</option>
              <option value="single">Одноместный</option>
              <option value="double">Двухместный</option>
              <option value="suite">Люкс</option>
            </select>
          </div>
          <div className="filter-group price-range">
            <label>Цена (₽)</label>
            <div className="price-inputs">
              <input type="number" placeholder="от" value={filters.priceFrom} onChange={e => setFilters({ ...filters, priceFrom: e.target.value })} />
              <input type="number" placeholder="до" value={filters.priceTo} onChange={e => setFilters({ ...filters, priceTo: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="filter-section">
          <h4>✨ Удобства</h4>
          <div className="amenities-grid">
            {availableAmenities.map(amenity => (
              <label key={amenity} className="checkbox-label">
                <input type="checkbox" checked={filters.amenities.includes(amenity)} onChange={() => handleAmenityChange(amenity)} />
                <span className="custom-checkbox"></span>
                {amenity}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-submit btn-search-trigger">Найти отели</button>
      </form>
    </div>
  );
}