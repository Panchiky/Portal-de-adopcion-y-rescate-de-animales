import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';

/* Estilos de Ionic (Obligatorios) */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Importación de tus pantallas */
import Login from './pages/auth/Login';
import CrearCuenta from './pages/auth/CrearCuenta';
import Explorar from './pages/user/Explorar';
import SolicitudesAdmin from './pages/admin/SolicitudesAdmin';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Rutas Públicas */}
        <Route exact path="/login" component={Login} />
        <Route exact path="/registro" component={CrearCuenta} />
        
        {/* Rutas de Usuario */}
        <Route exact path="/catalogo" component={Explorar} />
        
        {/* Rutas de Administrador */}
        <Route exact path="/admin/solicitudes" component={SolicitudesAdmin} />

        {/* Redirección por defecto al abrir la app */}
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;