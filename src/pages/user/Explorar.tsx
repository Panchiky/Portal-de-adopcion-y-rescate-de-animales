import React from 'react';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonInput, IonButton, IonIcon, IonText } from '@ionic/react';
import { searchOutline, documentTextOutline, notificationsOutline, personOutline, heartOutline, optionsOutline, heart } from 'ionicons/icons';
import './Explorar.css';

const Explorar: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen className="explore-content">
        <IonGrid className="explore-grid">
          <IonRow className="explore-row">
            
            {/* --- BARRA LATERAL (Desktop) --- */}
            <IonCol size="12" sizeMd="3" sizeLg="2.5" className="sidebar">
              <div className="sidebar-header">
                <div className="logo">
                  <span className="dot"></span> PatitasGo
                </div>
                <span className="logo-subtitle">ADOPCIÓN Y RESCATE</span>
              </div>

              <div className="nav-menu">
                <div className="nav-item active">
                  <IonIcon icon={searchOutline} />
                  <span>Explorar</span>
                </div>
                <div className="nav-item">
                  <IonIcon icon={documentTextOutline} />
                  <span>Postulaciones</span>
                </div>
                <div className="nav-item">
                  <IonIcon icon={notificationsOutline} />
                  <span>Alertas</span>
                </div>
                <div className="nav-item">
                  <IonIcon icon={personOutline} />
                  <span>Perfil</span>
                </div>
              </div>

              <div className="help-box">
                <h4>¿Necesitas ayuda?</h4>
                <p>Revisa preguntas frecuentes o contacta al refugio.</p>
                <IonButton expand="block" color="light" className="btn-help">
                  Centro de ayuda
                </IonButton>
              </div>
            </IonCol>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <IonCol size="12" sizeMd="9" sizeLg="9.5" className="main-content">
              
              <div className="top-section">
                <div className="header-info">
                  <div>
                    <h1 className="page-title">Explorar animales</h1>
                    <p className="page-subtitle">Ficha completa y una siguiente opción, sin gestos de rechazo.</p>
                  </div>
                  <div className="location-badge">
                    12 animales • 25 km
                  </div>
                </div>

                <div className="search-filter-container">
                  <div className="search-bar">
                    <IonInput placeholder="Buscar por nombre, especie o refugio"></IonInput>
                  </div>
                  <IonButton fill="outline" color="dark" className="btn-filter">
                    Filtros
                  </IonButton>
                </div>
              </div>

              <div className="cards-layout">
                
                <div className="main-animal-card">
                  <img 
                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Milo" 
                    className="main-animal-img"
                  />
                  <div className="main-animal-details">
                    <span className="status-badge">DISPONIBLE</span>
                    <h2 className="animal-name">Milo</h2>
                    <p className="animal-stats">Gato mestizo • Macho • 2 años • Mediano</p>
                    
                    <div className="tags-container">
                      <span className="tag">Sociable</span>
                      <span className="tag">Tranquilo</span>
                      <span className="tag">Energía media</span>
                    </div>

                    <p className="animal-desc">
                      Compañero sociable que disfruta las siestas al sol y busca un hogar estable y amoroso.
                    </p>

                    <h4 className="section-subtitle">Refugio y ubicación</h4>
                    <p className="text-muted">Huellas Felices • Valparaíso • a 14 km</p>
                    
                    <p className="text-muted">Salud: vacunas, desparasitación y esterilización al día.</p>

                    <IonButton expand="block" color="success" className="btn-postular" routerLink="/animales/1/postular">
                      Postular para adoptar
                    </IonButton>

                    <div className="action-buttons">
                      <IonButton fill="outline" color="dark" className="btn-secondary">
                        <IonIcon icon={heart} color="danger" slot="start" />
                        Añadir a favoritos
                      </IonButton>
                      <IonButton fill="outline" color="dark" className="btn-secondary">
                        Apadrinar
                      </IonButton>
                    </div>
                  </div>
                </div>

                <div className="next-animal-card">
                  <span className="next-label">SIGUIENTE ANIMAL</span>
                  <img 
                    src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Luna" 
                    className="next-animal-img"
                  />
                  <div className="next-animal-details">
                    <h3 className="animal-name-small">Luna</h3>
                    <p className="animal-stats-small">Gato naranja • Hembra • 4 años</p>
                    <p className="text-muted-small">Refugio Patitas • Viña del Mar • a 18 km</p>
                    
                    <IonButton expand="block" fill="outline" color="dark" className="btn-ver-ficha">
                      Ver ficha de Luna →
                    </IonButton>
                  </div>
                </div>

              </div>
            </IonCol>

          </IonRow>
        </IonGrid>

        {/* --- BARRA DE NAVEGACIÓN INFERIOR (Solo para móviles) --- */}
        <div className="mobile-bottom-nav">
          <div className="nav-item-mobile active">
            <IonIcon icon={searchOutline} />
            <span>Explorar</span>
          </div>
          <div className="nav-item-mobile">
            <IonIcon icon={documentTextOutline} />
            <span>Postulaciones</span>
          </div>
          <div className="nav-item-mobile">
            <IonIcon icon={notificationsOutline} />
            <span>Alertas</span>
          </div>
          <div className="nav-item-mobile">
            <IonIcon icon={personOutline} />
            <span>Perfil</span>
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Explorar;