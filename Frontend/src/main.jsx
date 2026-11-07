import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import TemaProvider from './context/TemaProvider';
import AvisosProvider from './context/AvisosProvider';
import AuthProvider from './context/AuthProvider';
import DatosProvider from './context/DatosProvider';
import FavoritosProvider from './context/FavoritosProvider';
import './index.css';
import './styles/comunes.css';
import App from './App.jsx';

// El orden importa: cada provider puede usar los que tiene por encima
// (por ejemplo los favoritos necesitan al usuario y los avisos).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <TemaProvider>
        <AvisosProvider>
          <AuthProvider>
            <DatosProvider>
              <FavoritosProvider>
                <App />
              </FavoritosProvider>
            </DatosProvider>
          </AuthProvider>
        </AvisosProvider>
      </TemaProvider>
    </BrowserRouter>
  </StrictMode>,
)
