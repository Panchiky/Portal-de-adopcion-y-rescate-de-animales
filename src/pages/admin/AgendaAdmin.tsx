import React, { useState } from 'react';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton } from '@ionic/react';
import { gridOutline, documentTextOutline, pawOutline, personOutline, arrowBackOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import './AgendaAdmin.css';

const AgendaAdmin: React.FC = () => {
  const navigate = useNavigate();

  const [bloques] = useState([
    { hora: '15:00', animal: 'Toby', postulante: 'Camila', disponible: false },
    { hora: '15:30', animal: 'Disponible', postulante: 'Reservable', disponible: true },
    { hora: '16:00', animal: 'Luna', postulante: 'Andrés', disponible: false },
    { hora: '16:30', animal: 'Disponible', postulante: 'Reservable', disponible: true },
    { hora: '17:00', animal: 'Max', postulante: 'Sofía', disponible: false },
    { hora: '17:30', animal: 'Disponible', postulante: 'Reservable', disponible: true },
  ]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="admin-content">
        <IonGrid className="admin-grid">
          <IonRow className="admin-row">
            
            {/* --- BARRA LATERAL (Desktop) --- */}
            <IonCol size="12" sizeMd="3" sizeLg="2.5" className="admin-sidebar">
              <div className="admin-sidebar-top">
                <div className="admin-logo">
                  <span className="admin-dot"></span> PatitasGo
                </div>
                <span className="admin-logo-subtitle">PANEL DEL REFUGIO</span>
                <div className="admin-nav-menu">
                  <div className="admin-nav-item" onClick={() => navigate('/admin/solicitudes')} style={{ cursor: 'pointer' }}>
                    <IonIcon icon={gridOutline} />
                    <span>Resumen</span>
                  </div>
                  <div className="admin-nav-item" onClick={() => navigate('/admin/solicitudes')} style={{ cursor: 'pointer' }}>
                    <IonIcon icon={documentTextOutline} />
                    <span>Solicitudes</span>
                  </div>
                  <div className="admin-nav-item" onClick={() => navigate('/admin/animales')} style={{ cursor: 'pointer' }}>
                    <IonIcon icon={pawOutline} />
                    <span>Animales</span>
                  </div>
                  <div className="admin-nav-item active" onClick={() => navigate('/admin/agenda')} style={{ cursor: 'pointer' }}>
                    <IonIcon icon={personOutline} />
                    <span>Agenda</span>
                  </div>
                </div>
              </div>
              <div className="admin-sidebar-bottom">
                <div className="refugio-info">
                  <h4>Huellas Felices</h4>
                  <p>Administrador</p>
                  <button className="btn-logout" onClick={handleLogout}>Cerrar sesión</button>
                </div>
              </div>
            </IonCol>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <IonCol size="12" sizeMd="9" sizeLg="9.5" className="admin-main">
              
              {/* Botón para volver a solicitudes */}
              <div className="mb-2">
                <IonButton fill="clear" color="dark" routerLink="/admin/solicitudes" className="btn-volver">
                  <IonIcon icon={arrowBackOutline} slot="start" />
                  Volver a solicitudes
                </IonButton>
              </div>

              <h4 className="overline-title">AGENDA DEL REFUGIO</h4>
              <h1 className="admin-page-title">Entrevistas · Jueves 17</h1>
              <p className="admin-page-subtitle">Una agenda única evita cruces entre entrevistas de distintos animales.</p>

              <div className="agenda-tabs">
                <button className="agenda-tab">Mié 16</button>
                <button className="agenda-tab active">Jue 17</button>
                <button className="agenda-tab">Vie 18</button>
                <button className="agenda-tab">Sáb 19</button>
              </div>

              <div className="agenda-layout">
                <div className="agenda-list">
                  {bloques.map((bloque, index) => (
                    <div className={`agenda-row-item ${bloque.disponible ? 'disponible' : 'ocupado'}`} key={index}>
                      <span className="agenda-hora">{bloque.hora}</span>
                      <span className="agenda-animal">{bloque.animal}</span>
                      <span className="agenda-postulante">{bloque.postulante}</span>
                    </div>
                  ))}
                </div>

                <div className="agenda-summary">
                  <div className="summary-card">
                    <h3>Resumen del día</h3>
                    <p><strong>3</strong> entrevistas<br/><strong>3</strong> bloques disponibles<br/><strong>0</strong> conflictos</p>
                    <p className="summary-text">Los bloques ocupados no se muestran al siguiente postulante.</p>
                    <div className="badge-conflictos">Sin conflictos</div>
                  </div>
                </div>
              </div>

            </IonCol>
          </IonRow>
        </IonGrid>

        {/* --- BARRA INFERIOR MÓVIL ADMIN --- */}
        <div className="admin-mobile-nav">
          <div className="admin-nav-item-mobile" onClick={() => navigate('/admin/solicitudes')} style={{ cursor: 'pointer' }}>
            <IonIcon icon={gridOutline} />
            <span>Resumen</span>
          </div>
          <div className="admin-nav-item-mobile" onClick={() => navigate('/admin/solicitudes')} style={{ cursor: 'pointer' }}>
            <IonIcon icon={documentTextOutline} />
            <span>Solicitudes</span>
          </div>
          <div className="admin-nav-item-mobile" onClick={() => navigate('/admin/animales')} style={{ cursor: 'pointer' }}>
            <IonIcon icon={pawOutline} />
            <span>Animales</span>
          </div>
          <div className="admin-nav-item-mobile active" onClick={() => navigate('/admin/agenda')} style={{ cursor: 'pointer' }}>
            <IonIcon icon={personOutline} />
            <span>Agenda</span>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AgendaAdmin;