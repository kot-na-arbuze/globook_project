// src/pages/HotelSearch.jsx
import React, { useState, useEffect } from 'react';
import SearchFilters from '../components/SearchFilters';
import HotelCard from '../components/HotelCard';
import { API_BASE } from '../App';

export default function HotelSearch({ user, openBooking, navigateTo }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { handleSearch({}); }, []);

  const handleSearch = async (searchFilters) => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (searchFilters.country) q.append('country', searchFilters.country);
      if (searchFilters.city) q.append('city', searchFilters.city);
      if (searchFilters.address) q.append('address', searchFilters.address);
      if (searchFilters.roomName) q.append('room_name', searchFilters.roomName);
      if (searchFilters.checkIn) q.append('check_in', searchFilters.checkIn);
      if (searchFilters.checkOut) q.append('check_out', searchFilters.checkOut);
      if (searchFilters.rating) q.append('rating', searchFilters.rating);
      if (searchFilters.roomType) q.append('room_type', searchFilters.roomType);
      if (searchFilters.priceFrom) q.append('price_from', searchFilters.priceFrom);
      if (searchFilters.priceTo) q.append('price_to', searchFilters.priceTo);
      if (searchFilters.amenities?.length > 0) {
        searchFilters.amenities.forEach(a => q.append('amenities[]', a));
      }
      const res = await fetch(`${API_BASE}/hotels/search?${q.toString()}`);
      const data = await res.json();
      setHotels(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Ошибка поиска:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page-layout">
      <aside className="search-sidebar">
        <SearchFilters onSearch={handleSearch} />
      </aside>
      <section className="search-results-content">
        <div className="search-meta-info">
          <h2>{loading ? 'Ищем варианты...' : `Найдено: ${hotels.length} отелей`}</h2>
        </div>
        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3].map(i => <div key={i} className="hotel-card-skeleton animate-pulse" />)}
          </div>
        ) : (
          <div className="hotels-list">
            {hotels.map(hotel => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onOpenPage={() => navigateTo('hotel', hotel)}
                onBookRoom={() => openBooking(null, hotel)}
              />
            ))}
            {hotels.length === 0 && (
              <div className="no-results">
                <p>🔍 Ничего не найдено. Попробуйте изменить фильтры.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}