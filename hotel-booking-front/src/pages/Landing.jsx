// src/pages/Landing.jsx
import React, { useEffect, useState } from 'react';
import { API_BASE } from '../App';

export default function Landing({ setCurrentPage, openBooking, user }) {
  const [featuredHotels, setFeaturedHotels] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/hotels/search`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setFeaturedHotels(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => {});
  }, []);

  return (
    <div className="landing-page">

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-backdrop"></div>
        <div className="hero-content">
          <p className="hero-eyebrow">Система бронирования нового поколения</p>
          <h1 className="hero-title">
            Найдите идеальный<br />
            <span className="hero-accent">отель за 30 секунд</span>
          </h1>
          <p className="hero-subtitle">
            Десятки отелей по всей России. Мгновенное подтверждение, честные цены.
          </p>
          <div className="hero-cta-row">
            <button className="btn btn-hero-primary" onClick={() => setCurrentPage('search')}>
              🔍 Найти отель
            </button>
            <button className="btn btn-hero-secondary" onClick={() => openBooking()}>
              📅 Забронировать
            </button>
          </div>
        </div>
      </section>

      {/* ПРЕИМУЩЕСТВА */}
      <section className="features-section container">
        <h2 className="section-title">Почему Globook?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Мгновенное бронирование</h3>
            <p>Подтверждение за секунды. Никаких ожиданий и звонков.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Защита от двойного бронирования</h3>
            <p>Алгоритм проверки дат гарантирует уникальность каждой брони.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Онлайн-оплата</h3>
            <p>Оплачивайте и управляйте бронями прямо в личном кабинете.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>По всей России</h3>
            <p>Москва, Санкт-Петербург, Сочи, Байкал и ещё десятки городов.</p>
          </div>
        </div>
      </section>

      {/* ПОПУЛЯРНЫЕ ОТЕЛИ */}
      {featuredHotels.length > 0 && (
        <section className="featured-section container">
          <h2 className="section-title">Популярные направления</h2>
          <div className="featured-hotels-grid">
            {featuredHotels.map(hotel => (
              <div key={hotel.id} className="featured-hotel-card" onClick={() => setCurrentPage('hotel', hotel)}>
                <div className="featured-card-img-wrapper">
                  <img src={hotel.photo} alt={hotel.name} />
                  <div className="featured-card-rating">⭐ {hotel.rating?.toFixed(1)}</div>
                </div>
                <div className="featured-card-body">
                  <h3>{hotel.name}</h3>
                  <p className="featured-card-geo">📍 {hotel.city}, {hotel.country}</p>
                  <p className="featured-card-desc">{hotel.description?.substring(0, 80)}...</p>
                  <div className="featured-card-footer">
                    <span className="featured-card-rooms">{hotel.availableRooms} номеров</span>
                    <button className="btn btn-sm" onClick={(e) => { e.stopPropagation(); setCurrentPage('hotel', hotel); }}>
                      Подробнее →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="section-cta">
            <button className="btn btn-outline-primary" onClick={() => setCurrentPage('search')}>
              Смотреть все отели →
            </button>
          </div>
        </section>
      )}

      {/* CTA БАННЕР */}
      <section className="cta-banner">
        <div className="container">
          <h2>Готовы к поездке?</h2>
          <p>Зарегистрируйтесь и получите доступ к эксклюзивным ценам</p>
          <div className="cta-banner-btns">
            {!user ? (
              <button className="btn btn-hero-primary" onClick={() => setCurrentPage('search')}>
                Найти отель
              </button>
            ) : (
              <button className="btn btn-hero-primary" onClick={() => setCurrentPage('search')}>
                Начать поиск
              </button>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}