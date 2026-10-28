import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [hoteles, setHoteles] = useState([]);
  const [error, setError] = useState('');

  // fetch de hoteles
  useEffect(() => {
    fetch('http://localhost:8080/api/hoteles')
      .then((res) => {
        if (!res.ok) throw new Error('error al conectar');
        return res.json();
      })
      .then((data) => setHoteles(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main style={{ padding: '2rem', paddingTop: '100px', maxWidth: '800px', margin: '0 auto' }}>
        <section style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.3rem', marginBottom: '0.5rem' }}>Bienvenido a Anteiku ☕</h1>
          <p className="subtitle" style={{ fontSize: '1.1rem' }}>
            Tu espacio ideal para encontrar y gestionar alojamientos
          </p>
        </section>

        {/* cartel de error */}
        {error && (
          <div style={{ background: '#ffe6e6', color: '#d9534f', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1.5rem' }}>
            <strong>Error:</strong> {error} (verificar backend en puerto 8080)
          </div>
        )}

        {/* lista */}
        <section id="hoteles">
          <h2 style={{ borderBottom: '2px solid #8c431d', paddingBottom: '0.5rem', marginBottom: '1.2rem' }}>
            Hoteles Disponibles
          </h2>
          
          {hoteles.length === 0 && !error ? (
            <p style={{ textAlign: 'center' }}>Cargando hoteles...</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {hoteles.map((hotel) => (
                <div 
                  key={hotel.id} 
                  className={`card ${darkMode ? 'dark-card' : 'light-card'}`}
                >
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{hotel.nombre}</h3>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>📍 Ciudad: {hotel.ciudad}</p>
                  <p style={{ margin: 0, opacity: 0.9 }}>{hotel.descripcion}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;