import React from 'react';
import {
  IonPage,
  IonContent,
  useIonRouter,
} from '@ionic/react';
import './home.css';

const Home: React.FC = () => {
  const router = useIonRouter();

  return (
    <IonPage className="petmatch-style-page">
      {/* Barra de navegación superior integrada */}
      <header className="pm-navbar">
        <div className="pm-nav-left">
          <div className="pm-logo" onClick={() => router.push('/')}>
            <span className="pm-logo-icon">🐾</span>
            <span className="pm-logo-text">PatitasGo</span>
          </div>

          <nav className="pm-nav-links">
            <span 
              className="pm-nav-link" 
              onClick={() => router.push('/catalogo')}
            >
              Adopta
            </span>
            <span 
              className="pm-nav-link" 
              onClick={() => router.push('/refugios')}
            >
              Refugios y organizaciones
            </span>
          </nav>
        </div>

        <div className="pm-nav-right">
          <button 
            type="button" 
            className="pm-btn-login"
            onClick={() => router.push('/login')}
          >
            Iniciar sesión
          </button>
          <button 
            type="button" 
            className="pm-btn-register"
            onClick={() => router.push('/registro')}
          >
            Regístrate
          </button>
        </div>
      </header>

      {/* Contenido con Fotografía de Fondo */}
      <IonContent fullscreen className="pm-content">
        <div className="pm-hero-container">
          {/* Capa de contraste suave para asegurar lectura nítida */}
          <div className="pm-overlay"></div>

          {/* Frase Original Central y Botón */}
          <div className="pm-hero-center">
            <h1 className="pm-title">
              Dale una segunda oportunidad<br />
              <span className="pm-title-accent">al amor más leal</span>
            </h1>

            <p className="pm-subtitle">
              Cientos de perros y gatos rescatados están esperando un hogar que los cuide.<br />
              Conoce sus historias, postula de forma sencilla y encuentra a tu nuevo compañero de vida.
            </p>

            <button 
              type="button" 
              className="pm-btn-cta"
              onClick={() => router.push('/catalogo')}
            >
              Adopta a tu mejor amigo →
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;