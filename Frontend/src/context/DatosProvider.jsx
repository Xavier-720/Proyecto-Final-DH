import { useState, useEffect, useCallback } from 'react';
import { DatosContext } from './contexts';
import { listarHoteles, listarAleatorios } from '../services/hotelService';
import { listarCategorias } from '../services/categoriaService';
import { listarCaracteristicas } from '../services/caracteristicaService';
import { listarOcupacion } from '../services/reservaService';
import { obtenerResumenes } from '../services/valoracionService';

export const FILTROS_VACIOS = {
  ciudad: '',
  checkIn: '',
  checkOut: '',
  caracteristicas: [], // nombres de las características elegidas
  categorias: [], // ids de las categorías elegidas
  soloFavoritos: false,
  pagina: 1,
};

// Datos compartidos de toda la app. Se cargan una sola vez acá, así el home, el panel de admin
// y los modales usan las mismas listas y un cambio del administrador se ve en todos lados.
function DatosProvider({ children }) {
  const [hoteles, setHoteles] = useState([]);
  const [aleatorios, setAleatorios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [ocupacion, setOcupacion] = useState([]);
  const [resumenes, setResumenes] = useState({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  // filtros del buscador: viven acá para no perderse al entrar al detalle de un hotel y volver
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);

  const cargarTodo = useCallback(async () => {
    setCargando(true);
    setError(false);
    try {
      const [h, a, c, f, o, r] = await Promise.all([
        listarHoteles(),
        listarAleatorios(),
        listarCategorias(),
        listarCaracteristicas(),
        listarOcupacion(),
        obtenerResumenes(),
      ]);
      setHoteles(h);
      setAleatorios(a);
      setCategorias(c);
      setCaracteristicas(f);
      setOcupacion(o);
      setResumenes(r);
    } catch (err) {
      console.error('Error al cargar los datos:', err);
      setError(true);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  // recargas puntuales (después de reservar, valorar o editar una característica)
  const recargarHoteles = useCallback(() => listarHoteles().then(setHoteles).catch(console.error), []);
  const recargarOcupacion = useCallback(() => listarOcupacion().then(setOcupacion).catch(console.error), []);
  const recargarResumenes = useCallback(() => obtenerResumenes().then(setResumenes).catch(console.error), []);

  // --- hoteles (el panel de admin ya guardó en el servidor, acá solo se actualizan las listas) ---
  const agregarHotel = (nuevo) => setHoteles((prev) => [nuevo, ...prev]);

  const reemplazarHotel = (editado) => {
    setHoteles((prev) => prev.map((h) => (h.id === editado.id ? editado : h)));
    setAleatorios((prev) => prev.map((h) => (h.id === editado.id ? editado : h)));
  };

  const quitarHotel = (id) => {
    setHoteles((prev) => prev.filter((h) => h.id !== id));
    setAleatorios((prev) => prev.filter((h) => h.id !== id));
  };

  // --- categorías ---
  const agregarCategoria = (nueva) => setCategorias((prev) => [...prev, nueva]);
  const quitarCategoria = (id) => setCategorias((prev) => prev.filter((c) => c.id !== id));

  // --- características ---
  const agregarCaracteristica = (nueva) => setCaracteristicas((prev) => [...prev, nueva]);
  const reemplazarCaracteristica = (editada) =>
    setCaracteristicas((prev) => prev.map((c) => (c.id === editada.id ? editada : c)));
  const quitarCaracteristica = (id) => setCaracteristicas((prev) => prev.filter((c) => c.id !== id));

  const limpiarFiltros = () => setFiltros(FILTROS_VACIOS);

  const valor = {
    hoteles, aleatorios, categorias, caracteristicas, ocupacion, resumenes,
    cargando, error, cargarTodo,
    filtros, setFiltros, limpiarFiltros,
    recargarHoteles, recargarOcupacion, recargarResumenes,
    agregarHotel, reemplazarHotel, quitarHotel,
    agregarCategoria, quitarCategoria,
    agregarCaracteristica, reemplazarCaracteristica, quitarCaracteristica,
  };

  return <DatosContext.Provider value={valor}>{children}</DatosContext.Provider>;
}

export default DatosProvider;
