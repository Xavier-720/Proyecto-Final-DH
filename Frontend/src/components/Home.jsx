import { useState } from 'react';
import HotelCard from './HotelCard';
import RangoFechas from './RangoFechas';

const POR_PAGINA = 10;

// pantalla principal: buscador, categorias y recomendaciones
function Home({
  hoteles, aleatorios, categorias, caracteristicas, reservas, favoritos, resumenes,
  filtros, setFiltros, onLimpiar, onToggleFavorito, onSelectHotel, darkMode,
}) {
  const [verCalendario, setVerCalendario] = useState(false);

  // cambia un filtro y vuelve a la pagina 1
  const cambiar = (campo, valor) => setFiltros({ ...filtros, [campo]: valor, pagina: 1 });

  // agrega o saca un valor de una lista (categorias, caracteristicas)
  const alternar = (campo, valor) => {
    const lista = filtros[campo];
    cambiar(campo, lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor]);
  };

  const hayFiltros = filtros.ciudad.trim() !== '' || filtros.checkIn || filtros.checkOut ||
    filtros.caracteristicas.length > 0 || filtros.soloFavoritos || filtros.categorias.length > 0;

  const ciudades = [...new Set(hoteles.map((h) => h.ciudad))].sort();

  const filtrados = hoteles.filter((h) => {
    if (filtros.categorias.length > 0 && !filtros.categorias.includes(h.categoria)) return false;

    // busca por ciudad o por nombre
    const texto = filtros.ciudad.trim().toLowerCase();
    if (texto !== '' && !(h.ciudad || '').toLowerCase().includes(texto) && !(h.nombre || '').toLowerCase().includes(texto)) {
      return false;
    }

    if (filtros.soloFavoritos && !favoritos.includes(h.id)) return false;

    // si eligio fechas, se sacan los hoteles que ya tienen una reserva en esos dias
    if (filtros.checkIn && filtros.checkOut) {
      const hayChoque = reservas.some((r) =>
        r.hotelId === h.id && filtros.checkIn <= r.fechaCheckOut && filtros.checkOut >= r.fechaCheckIn
      );
      if (hayChoque) return false;
    }

    // tiene que tener todas las caracteristicas elegidas
    const nombres = (h.caracteristicas || []).map((c) => c.nombre);
    return filtros.caracteristicas.every((c) => nombres.includes(c));
  });

  const totalPaginas = Math.ceil(filtrados.length / POR_PAGINA) || 1;
  const inicio = (filtros.pagina - 1) * POR_PAGINA;

  // US#4: sin filtros, la primera pagina muestra los 10 aleatorios
  const mostrados = (!hayFiltros && filtros.pagina === 1 && aleatorios.length > 0)
    ? aleatorios
    : filtrados.slice(inicio, inicio + POR_PAGINA);

  const irAPagina = (n) => setFiltros({ ...filtros, pagina: n });

  const buscar = () => {
    setVerCalendario(false);
    irAPagina(1);
    document.getElementById('resultados')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-view-wrapper">
      <section className="search-section">
        <div className="search-header-banner">
          <h2>Buscá ofertas en hoteles, cabañas y más</h2>
          <p className="search-subtitle">Descubrí alojamientos únicos para tu estadía en Anteiku.</p>
        </div>

        <div className="search-body-content">
          <div className="search-inputs-grid">
            <div className="search-field-group">
              <label>Destino / Ciudad</label>
              <input
                type="text"
                list="lista-ciudades"
                placeholder="¿A qué ciudad querés ir? (Ej: Madrid)"
                value={filtros.ciudad}
                onChange={(e) => cambiar('ciudad', e.target.value)}
              />
              {/* sugerencias mientras escribe (US#22) */}
              <datalist id="lista-ciudades">
                {ciudades.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>

            <div className="search-field-group">
              <label>Fechas</label>
              <button type="button" className="fecha-boton" onClick={() => setVerCalendario(!verCalendario)}>
                📅 {filtros.checkIn ? `${filtros.checkIn} → ${filtros.checkOut || '...'}` : 'Check-in - Check-out'}
              </button>
            </div>
          </div>

          {verCalendario && (
            <RangoFechas
              inicio={filtros.checkIn}
              fin={filtros.checkOut}
              onChange={(i, f) => setFiltros({ ...filtros, checkIn: i, checkOut: f, pagina: 1 })}
            />
          )}

          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={filtros.soloFavoritos}
                onChange={() => cambiar('soloFavoritos', !filtros.soloFavoritos)}
                style={{ width: '16px', height: '16px', accentColor: '#6f3c1b' }}
              />
              ❤️ Mostrar solo mis favoritos guardados ({favoritos.length})
            </label>
          </div>

          <div className="features-filter-container">
            <span className="features-filter-title">Filtrar por características (opcional):</span>
            <div className="features-chips-grid">
              {caracteristicas.map((carac) => (
                <div
                  key={carac.id}
                  className={`feature-chip ${filtros.caracteristicas.includes(carac.nombre) ? 'active' : ''}`}
                  onClick={() => alternar('caracteristicas', carac.nombre)}
                >
                  <span>{carac.icono || '✨'}</span>
                  <span>{carac.nombre}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="search-actions-bar">
            {hayFiltros && (
              <button onClick={onLimpiar} className="btn-clear-filters">Limpiar filtros</button>
            )}
            <button className="btn-search-main" onClick={buscar}>Realizar búsqueda</button>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="seccion-titulo">
          <h3>Categorías</h3>
          {filtros.categorias.length > 0 && (
            <button className="back-btn-clean" onClick={() => cambiar('categorias', [])}>
              ✕ Ver todos ({hoteles.length})
            </button>
          )}
        </div>
        <div className="categories-grid">
          {categorias.map((cat) => {
            const cantidad = hoteles.filter((h) => h.categoria === cat.titulo).length;
            const activa = filtros.categorias.includes(cat.titulo);
            return (
              <div
                key={cat.id}
                className={`category-card ${darkMode ? 'dark-card' : 'light-card'}`}
                onClick={() => alternar('categorias', cat.titulo)}
                style={{ cursor: 'pointer', border: activa ? '2px solid #6f3c1b' : undefined }}
              >
                <img src={cat.imagen} alt={cat.titulo} />
                <h4>{cat.titulo}</h4>
                <p>{cantidad} lugares</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="recommendations-section" id="resultados">
        <div className="seccion-titulo">
          <h3>{filtros.categorias.length > 0 ? `Categoría: ${filtros.categorias.join(', ')}` : 'Recomendaciones'}</h3>
          <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>
            Mostrando {mostrados.length} de {filtrados.length} (total {hoteles.length})
          </span>
        </div>

        {filtrados.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem 0', opacity: 0.8 }}>
            No se encontraron alojamientos para los filtros aplicados.
          </p>
        ) : (
          <>
            <div className="hotels-grid">
              {mostrados.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  esFavorito={favoritos.includes(hotel.id)}
                  resumen={resumenes[hotel.id]}
                  darkMode={darkMode}
                  onToggleFavorito={onToggleFavorito}
                  onClick={() => onSelectHotel(hotel)}
                />
              ))}
            </div>

            {/* US#8: paginacion de 10 en 10 */}
            <div className="pagination">
              <button className="page-btn" onClick={() => irAPagina(1)} disabled={filtros.pagina === 1}>« Inicio</button>
              <button className="page-btn" onClick={() => irAPagina(filtros.pagina - 1)} disabled={filtros.pagina === 1}>‹ Anterior</button>
              <span className="page-info">Pág {filtros.pagina} / {totalPaginas}</span>
              <button className="page-btn" onClick={() => irAPagina(filtros.pagina + 1)} disabled={filtros.pagina === totalPaginas}>Sig ›</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Home;
