import React from 'react';

export default function Footer() {
  return (
    <footer className="footer-light">
      <div className="container footer-content">
        <p>&copy; {new Date().getFullYear()} Globook Inc. Система динамического бронирования отелей.</p>
        <div className="footer-links">
          <a href="#terms">Условия использования</a>
          <a href="#privacy">Конфиденциальность</a>
        </div>
      </div>
    </footer>
  );
}