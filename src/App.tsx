import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Navigate } from 'react-router-dom';

/* Estilos de Ionic (Obligatorios) */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Importación de tus pantallas de Auth y User */
import Login from './pages/auth/Login';
import CrearCuenta from './pages/auth/CrearCuenta';
import Explorar from './pages/user/Explorar';

/* Importación de tu nueva pantalla de Admin */
import SolicitudesAdmin from './pages/admin/SolicitudesAdmin';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Rutas activas - Sintaxis v6 */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<CrearCuenta />} />
        <Route path="/catalogo" element={<Explorar />} />
        
        {/* Ruta para el panel de administración */}
        <Route path="/admin/solicitudes" element={<SolicitudesAdmin />} />
        
        {/* Redirección por defecto al abrir la app */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;