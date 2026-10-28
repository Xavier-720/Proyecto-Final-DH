import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AdminHotelModal from './components/AdminHotelModal';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [hoteles, setHoteles] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // mezcla array pa aleatorios
  const shuffle = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // trae datos y corta a 10
  useEffect(() => {
    fetch('http://localhost:8080/api/hoteles')
      .then((res) => {
        if (!res.ok) throw new Error('error al conectar');
        return res.json();
      })
      .then((data) => {
        const randomList = shuffle(data).slice(0, 10);
        setHoteles(randomList);
      })
      .catch((err) => setError(err.message));
  }, []);

  // agrega nuevo item
  const handleHotelCreated = (nuevo) => {
    setHoteles((prev) => [nuevo, ...prev].slice(0, 10));
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="main-content">
        
        {/* barra admin */}
        <div className="admin-bar">
          <span className="admin-title">Panel de Administración</span>
          <button className="btn-alta" onClick={() => setIsModalOpen(true)}>
            Agregar producto
          </button>
        </div>

        {/* buscador */}
        <section className="search-section">
          <h2>Encontrá tu estadía en Anteiku</h2>
          <div className="search-bar">
            <input type="text" placeholder="¿A qué ciudad querés viajar?" />
            <button className="search-btn">Buscar</button>
          </div>
        </section>

        {/* categorias */}
        <section className="categories-section">
          <h3>Categorías</h3>
          <div className="categories-grid">
            <div className={`category-card ${darkMode ? 'dark-card' : 'light-card'}`}>
              <span>☕</span>
              <p>Café & Descanso</p>
            </div>
            <div className={`category-card ${darkMode ? 'dark-card' : 'light-card'}`}>
              <span>🌙</span>
              <p>Nocturnas</p>
            </div>
            <div className={`category-card ${darkMode ? 'dark-card' : 'light-card'}`}>
              <span>🏛️</span>
              <p>Clásicos</p>
            </div>
          </div>
        </section>

        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error} (verificar backend en puerto 8080)
          </div>
        )}

        {/* recomendaciones */}
        <section className="recommendations-section">
          <h3>Recomendaciones</h3>
          
          {hoteles.length === 0 && !error ? (
            <p className="loading-text">Cargando recomendaciones...</p>
          ) : (
            <div className="hotels-grid">
              {hoteles.map((hotel) => (
                <div key={hotel.id} className={`card ${darkMode ? 'dark-card' : 'light-card'}`}>
                  <h4>{hotel.nombre}</h4>
                  <p className="hotel-city">📍 {hotel.ciudad}</p>
                  <p className="hotel-desc">{hotel.descripcion}</p>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      <AdminHotelModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onHotelCreated={handleHotelCreated}
        darkMode={darkMode}
      />
    </div>
  );
}

export default App;