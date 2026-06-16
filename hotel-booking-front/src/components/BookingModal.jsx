import React, { useState, useEffect } from 'react';

export default function BookingModal({ isOpen, onClose, user }) {
  const [bookingData, setBookingData] = useState({
    country: '', city: '', address: '', room: '',
    checkIn: '', checkOut: '', guests: 1
  });
  const [nights, setNights] = useState(0);
  const pricePerNight = 4500;

  useEffect(() => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const start = new Date(bookingData.checkIn);
      const end = new Date(bookingData.checkOut);
      const diff = end - start;
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setNights(days > 0 ? days : 0);
    } else {
      setNights(0);
    }
  }, [bookingData.checkIn, bookingData.checkOut]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <div className="modal-content">
          <h2>Оформление бронирования</h2>
          <form onSubmit={(e) => { e.preventDefault(); alert('Заказ оформлен!'); onClose(); }}>
            <div className="form-grid">
              <div className="form-group">
                <label>Страна</label>
                <input type="text" placeholder="Например: Россия" list="modal-countries" required onChange={(e) => setBookingData({...bookingData, country: e.target.value})} />
                <datalist id="modal-countries"><option value="Россия"/><option value="Франция"/></datalist>
              </div>
              <div className="form-group">
                <label>Город</label>
                <input type="text" placeholder="Москва" list="modal-cities" required onChange={(e) => setBookingData({...bookingData, city: e.target.value})} />
                <datalist id="modal-cities"><option value="Москва"/><option value="Санкт-Петербург"/></datalist>
              </div>
              <div className="form-group max-width-row">
                <label>Адрес отеля</label>
                <input type="text" placeholder="Улица, дом" list="modal-addresses" required onChange={(e) => setBookingData({...bookingData, address: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Номер/Класс</label>
                <input type="text" placeholder="Стандарт, Люкс..." list="modal-rooms" required onChange={(e) => setBookingData({...bookingData, room: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Количество гостей</label>
                <select value={bookingData.guests} onChange={(e) => setBookingData({...bookingData, guests: Number(e.target.value)})}>
                  {[...Array(10)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Дата заезда</label>
                <input type="date" required onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Дата выезда</label>
                <input type="date" required onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})} />
              </div>
              <div className="form-group">
                <label>ФИО гостя</label>
                <input type="text" value={user ? `${user.lastName} ${user.firstName}` : 'Не авторизован'} readOnly className="readonly-input" />
              </div>
              <div className="form-group">
                <label>Телефон</label>
                <input type="text" value={user ? user.phone : 'Не авторизован'} readOnly className="readonly-input" />
              </div>
            </div>

            <div className="booking-summary-box">
              <p>Длительность проживания: <strong>{nights} ночей</strong></p>
              <p>Цена за ночь: <strong>{pricePerNight} ₽</strong></p>
              <hr />
              <p className="total-price">Итого: <span>{nights * pricePerNight} ₽</span></p>
            </div>

            <button type="submit" className="btn btn-submit">Осуществить заказ</button>
          </form>
        </div>
      </div>
    </div>
  );
}