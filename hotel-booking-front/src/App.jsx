import React from 'react';
import logo from './assets/globook_logo.svg'; 

const mockHotels = [
  { id: 1, name: "Отель 1", city: "г. Севастополь", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", desc: "отель отель отель отель отель отель отель отель отель отель отель отель отель отель отель отель отель" },
  { id: 2, name: "Отель 2", city: "г. Севастополь", img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500", desc: "отель отель отель отель отель отель отель отель отель отель отель отель отель отель отель отель отель" },
  { id: 3, name: "Отель 3", city: "г. Севастополь", img: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=500", desc: "отель отель отель отель отель отель отель отель отель отель отель отель отель отель отель отель отель" },
  { id: 4, name: "Отель 4", city: "г. Севастополь", img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500", desc: "отель отель отель отель отель отель отель отель отель отель отель отель отель отель отель отель отель" },
];

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
          <header 
          style={{ 
            background: 'linear-gradient(135deg, #008E93 0%, #00574D 100%)' 
          }} 
        className="text-white pt-3 pb-5 shadow-sm"
        >
        <div className="container">
          
          <div className="d-flex align-items-center mb-5 position-relative">
            
            <div className="me-auto" style={{ width: '180px' }}></div>

            <div className="mx-auto">
              <img src={logo} alt="GloBook" style={{ height: '140px', objectFit: 'contain' }} />
            </div>

            <div className="ms-auto d-flex justify-content-end" style={{ width: '180px' }}>
              <button className="btn btn-light rounded-pill me-2 px-4 fw-medium text-dark">Регистрация</button>
              <button className="btn btn-outline-light rounded-pill px-4 fw-medium">Вход</button>
            </div>

          </div>

          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="input-group bg-white rounded-pill p-1 shadow">
                <input 
                  type="text" 
                  className="form-control border-0 bg-transparent ps-4" 
                  placeholder="Какой отель вы ищите?" 
                />
                <button className="btn btn-light border-0 bg-transparent px-3 text-muted">
                  ⚙️ 
                </button>
                <button className="btn rounded-pill px-4 fw-bold text-white" style={{ backgroundColor: '#008080' }}>
                  Поиск
                </button>
              </div>
            </div>
          </div>

        </div>
      </header>

      <main className="container my-5 flex-grow-1">
        <h2 className="fw-bold mb-5 text-dark">Доступные для бронирования отели в г. Севастополе</h2>
        
        <div className="row g-4">
          
          {mockHotels.map(hotel => (
            <div className="col-lg-3 col-md-6" key={hotel.id}>
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                <img 
                  src={hotel.img} 
                  className="card-img-top" 
                  alt={hotel.name} 
                  style={{ height: '180px', objectFit: 'cover' }} 
                />
                <div className="card-body d-flex flex-column p-4">
                  <h4 className="card-title fw-bold mb-2">{hotel.name}</h4>
                  <p className="card-text text-muted flex-grow-1" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                    {hotel.desc}
                  </p>
                  <button className="btn btn-outline-secondary rounded-pill w-100 mt-3 py-2 fw-medium">
                    Забронировать
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="col-lg-3 col-md-6">
            <div className="card h-100 border-0 shadow-sm rounded-4 d-flex align-items-center justify-content-center bg-white border">
              <div className="card-body d-flex align-items-center justify-content-center">
                <a href="#" className="text-decoration-none text-dark fw-bold fs-5">
                  Посмотреть все
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="bg-white py-4 border-top text-muted" style={{ fontSize: '0.9rem' }}>
        <div className="container d-flex justify-content-between align-items-center">
          <div>© 2026 Globook, Inc.</div>
          <div className="d-flex gap-3">
            <a href="#" className="text-muted text-decoration-none border-bottom">Конфиденциальность</a>
            <a href="#" className="text-muted text-decoration-none">Условия</a>
          </div>
        </div>
      </footer>

    </div>
  );
}