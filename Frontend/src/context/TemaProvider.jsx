import { useState, useEffect } from 'react';
import { TemaContext } from './contexts';

const CLAVE = 'tema';

// Modo claro / oscuro. La clase se pone en <html> y los estilos se resuelven con CSS
// (.dark-mode .algo { ... }), por eso los componentes no necesitan recibir darkMode por props.
function TemaProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem(CLAVE) === 'oscuro';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const raiz = document.documentElement;
    raiz.classList.toggle('dark-mode', darkMode);
    raiz.classList.toggle('light-mode', !darkMode);

    // se guarda la elección para que no se pierda al recargar
    try {
      localStorage.setItem(CLAVE, darkMode ? 'oscuro' : 'claro');
    } catch {
      // si el navegador no deja guardar, el tema simplemente no se recuerda
    }
  }, [darkMode]);

  const alternarTema = () => setDarkMode((actual) => !actual);

  return <TemaContext.Provider value={{ darkMode, alternarTema }}>{children}</TemaContext.Provider>;
}

export default TemaProvider;
