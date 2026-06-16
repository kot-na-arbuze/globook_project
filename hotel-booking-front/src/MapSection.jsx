import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Стилизуем иконку огонька (светящаяся точка вместо стандартного маркера)
const glowIcon = new L.DivIcon({
  className: 'custom-glow-marker',
  html: '<div class="firefly"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

export default function MapSection({ hotels }) {
  // Координаты центра карты при запуске (центр Европы / мира)
  const centerPosition = [48.8566, 2.3522]; 

  return (
    /* Высота жестко зафиксирована на 500px, чтобы карта не ломала и не растягивала страницу */
    <div style={{ height: "500px", width: "100%", overflow: "hidden" }}>
      <MapContainer center={centerPosition} zoom={3} style={{ height: "100%", width: "100%", background: "#1a1a1a" }}>
        
        {/* Ночной темный слой карты */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* Перебираем отели и ставим маркеры */}
        {hotels?.map(hotel => {
          if (hotel.lat && hotel.lng) {
            return (
              <Marker key={hotel.id} position={[hotel.lat, hotel.lng]} icon={glowIcon}>
                <Popup>
                  <div style={{ color: "#121212", fontFamily: "sans-serif" }}>
                    <strong>{hotel.name}</strong><br />
                    {hotel.city}<br />
                    <span style={{ color: "green", fontWeight: "bold" }}>{hotel.price} ₽/ночь</span>
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
}