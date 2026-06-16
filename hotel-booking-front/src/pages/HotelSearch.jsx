import React, { useState } from 'react';
import SearchFilters from '../components/SearchFilters';
import HotelCard from '../components/HotelCard';

// Временные тестовые данные отелей для проверки отображения
const mockHotels = [
  {
    id: 1,
    name: 'Гранд Отель Бельведер',
    country: 'Франция', city: 'Париж', address: 'Rue de Rivoli, 45',
    description: 'Роскошный исторический отель в самом сердце Парижа с видом на Лувр и изысканной французской кухней.',
    phone: '+33 1 42 96 10 00',
    rating: 9.6,
    availableRooms: 4,
    photo: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500'
  },
  {
    id: 2,
    name: 'Метрополь Премьер',
    country: 'Россия', city: 'Москва', address: 'Театральный проезд, д. 2',
    description: 'Легендарный отель с вековой историей, уникальной архитектурой модерна и шаговой доступностью до Красной площади.',
    phone: '+7 (495) 225-88-88',
    rating: 9.2,
    availableRooms: 11,
    photo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'
  },
  {
    id: 3,
    name: 'Римский Колизей Резорт',
    country: 'Италия', city: 'Рим', address: 'Via dei Fori Imperiali, 10',
    description: 'Уютные номера в классическом итальянском стиле, оборудованные просторными террасами с панорамой древнего города.',
    phone: '+39 06 699 1234',
    rating: 8.9,
    availableRooms: 7,
    photo: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500'
  }
];

export default function HotelSearch() {
  const [hotels, setHotels] = useState(mockHotels);

  const handleSearch = (searchFilters) => {
    console.log('Вызваны фильтры поиска:', searchFilters);
    // Тут в будущем будет fetch-запрос на ваш Rails бэкенд:
    // fetch(`http://localhost:3000/hotels/search?country=${searchFilters.country}...`)
  };

  return (
    <div className="search-page-layout">
      {/* Левая колонка — фильтры */}
      <aside className="search-sidebar">
        <SearchFilters onSearch={handleSearch} />
      </aside>

      {/* Правая колонка — результаты поиска */}
      <section className="search-results-content">
        <div className="search-meta-info">
          <h2>Найдено вариантов: {hotels.length}</h2>
        </div>

        {/* Сетка карточек: выводит строго по две карточки в строку */}
        <div className="hotels-grid-layout">
          {hotels.map(hotel => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </section>
    </div>
  );
}