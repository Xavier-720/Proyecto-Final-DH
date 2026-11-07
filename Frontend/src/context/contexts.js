import { createContext } from 'react';

// Los contextos se crean acá y cada Provider (en esta misma carpeta) les da el valor.
// Para usarlos desde un componente están los hooks de /hooks (useAuth, useTema, etc.).
export const AuthContext = createContext(null);
export const TemaContext = createContext(null);
export const AvisosContext = createContext(null);
export const DatosContext = createContext(null);
export const FavoritosContext = createContext(null);
