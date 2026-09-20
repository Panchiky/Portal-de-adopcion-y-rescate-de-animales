import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Navigate } from 'react-router-dom';

/* Estilos de Ionic (Obligatorios) */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Importación de tus pantallas de Auth */
import Login from './pages/auth/Login';
import CrearCuenta from './pages/auth/CrearCuenta';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Rutas activas - Sintaxis v6 */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<CrearCuenta />} />
        
        {/* Redirección por defecto al abrir la app */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;