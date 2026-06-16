import React, { useState, useEffect } from 'react';
import SearchFilters from '../components/SearchFilters';
import HotelCard from '../components/HotelCard';
import { API_BASE } from '../App';

export default function HotelSearch({ setActiveModal, user }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  // При первой загрузке подтягиваем все доступные отели
  useEffect(() => {
    handleSearch({});
  }, []);

  const handleSearch = async (searchFilters) => {
    setLoading(true);
    try {
      // Превращаем объект фильтров фронтенда в GET-параметры для Rails
      const queryParams = new URLSearchParams();
      if (searchFilters.country) queryParams.append('country', searchFilters.country);
      if (searchFilters.city) queryParams.append('city', searchFilters.city);
      if (searchFilters.address) queryParams.append('address', searchFilters.address);
      if (searchFilters.roomName) queryParams.append('room_name', searchFilters.roomName);
      if (searchFilters.checkIn) queryParams.append('check_in', searchFilters.checkIn);
      if (searchFilters.checkOut) queryParams.append('check_out', searchFilters.checkOut);
      if (searchFilters.rating) queryParams.append('rating', searchFilters.rating);
      if (searchFilters.roomType) queryParams.append('room_type', searchFilters.roomType);
      if (searchFilters.priceFrom) queryParams.append('price_from', searchFilters.priceFrom);
      if (searchFilters.priceTo) queryParams.append('price_to', searchFilters.priceTo);
      
      if (searchFilters.amenities && searchFilters.amenities.length > 0) {
        searchFilters.amenities.forEach(a => queryParams.append('amenities[]', a));
      }

      const response = await fetch(`${API_BASE}/hotels/search?${queryParams.toString()}`);
      const data = await response.json();
      setHotels(data);
    } catch (err) {
      console.error('Ошибка поиска отелей:', err);
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
          <h2>{loading ? 'Поиск вариантов...' : `Найдено вариантов: ${hotels.length}`}</h2>
        </div>

        <div className="hotels-grid-layout">
          {hotels.map(hotel => (
            // Передаем пропсы для открытия модалки бронирования, если это нужно карточке отеля
            <HotelCard key={hotel.id} hotel={hotel} setActiveModal={setActiveModal} user={user} />
          ))}
        </div>
      </section>
    </div>
  );
}