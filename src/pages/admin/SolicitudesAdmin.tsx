import React, { useState } from 'react';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon } from '@ionic/react';
import { 
  gridOutline, 
  documentTextOutline, 
  pawOutline, 
  personOutline, 
  ellipsisHorizontal,
  searchOutline
} from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import './SolicitudesAdmin.css';

const SolicitudesAdmin: React.FC = () => {
  const navigate = useNavigate();

  const [solicitudes] = useState([
    { id: 1, iniciales: 'TG', colorAvatar: '#fef0c7', colorTexto: '#b45309', nombre: 'Tomás Guerra', rut: 'RUT •• 285.432-1', animal: 'Milo', fecha: '14 sep', estado: 'PENDIENTE', estadoClase: 'estado-pendiente', accion: 'Revisar' },
    { id: 2, iniciales: 'CM', colorAvatar: '#e0f2fe', colorTexto: '#0369a1', nombre: 'Camila Morales', rut: 'RUT •• 456.789-0', animal: 'Milo', fecha: '13 sep', estado: 'EN REVISIÓN', estadoClase: 'estado-revision', accion: 'Preseleccionar' },
    { id: 3, iniciales: 'JP', colorAvatar: '#dcfce7', colorTexto: '#15803d', nombre: 'Javier Pérez', rut: 'RUT •• 345.678-9', animal: 'Simón', fecha: '12 sep', estado: 'ENTREVISTA AGENDADA', estadoClase: 'estado-entrevista', accion: 'Ver agenda' },
    { id: 4, iniciales: 'AV', colorAvatar: '#fee2e2', colorTexto: '#b91c1c', nombre: 'Ana Vera', rut: 'RUT •• 234.567-8', animal: 'Milo', fecha: '11 sep', estado: 'RECHAZADA', estadoClase: 'estado-rechazada', accion: 'Revisar' }
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
                  <div className="admin-nav-item active" onClick={() => navigate('/admin/solicitudes')} style={{ cursor: 'pointer' }}>
                    <IonIcon icon={documentTextOutline} />
                    <span>Solicitudes</span>
                  </div>
                  <div className="admin-nav-item" onClick={() => navigate('/admin/animales')} style={{ cursor: 'pointer' }}>
                    <IonIcon icon={pawOutline} />
                    <span>Animales</span>
                  </div>
                  <div className="admin-nav-item" onClick={() => navigate('/admin/agenda')} style={{ cursor: 'pointer' }}>
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
              
              {/* Encabezado */}
              <div className="admin-header-info">
                <div>
                  <h1 className="admin-page-title">Gestión de solicitudes</h1>
                  <p className="admin-page-subtitle">Revisa antecedentes, preselecciona y deja que PatitasGo coordine los horarios.</p>
                </div>
                <IonButton fill="outline" color="dark" className="btn-export">
                  Exportar resumen
                </IonButton>
              </div>

              {/* Tarjetas de Estadísticas */}
              <div className="stats-cards-container">
                <div className="admin-stat-card">
                  <h3>12</h3>
                  <p>Pendientes</p>
                </div>
                <div className="admin-stat-card bg-blue">
                  <h3>5</h3>
                  <p>En revisión</p>
                </div>
                <div className="admin-stat-card bg-green">
                  <h3>8</h3>
                  <p>Entrevistas</p>
                </div>
                <div className="admin-stat-card bg-red">
                  <h3>3</h3>
                  <p>Rechazadas</p>
                </div>
              </div>

              {/* Filtros */}
              <div className="filters-container">
                <div className="search-bar">
                  <IonIcon icon={searchOutline} className="search-icon" />
                  <input type="text" placeholder="Buscar por persona o animal" />
                </div>
                <div className="filter-buttons">
                  <button className="filter-btn">Estado: Todos</button>
                  <button className="filter-btn">Animal: Todos</button>
                </div>
                <div className="update-label">
                  <span>Actualizado hoy</span>
                </div>
              </div>

              {/* --- VISTA DESKTOP: TABLA --- */}
              <div className="desktop-table-container">
                <table className="requests-table">
                  <thead>
                    <tr>
                      <th>POSTULANTE</th>
                      <th>ANIMAL</th>
                      <th>FECHA</th>
                      <th>ESTADO</th>
                      <th>ACCIÓN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {solicitudes.map((sol) => (
                      <tr key={sol.id}>
                        <td>
                          <div className="postulante-cell">
                            <div className="avatar" style={{ backgroundColor: sol.colorAvatar, color: sol.colorTexto }}>
                              {sol.iniciales}
                            </div>
                            <div>
                              <div className="postulante-nombre">{sol.nombre}</div>
                              <div className="postulante-rut">{sol.rut}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-dark font-medium">{sol.animal}</td>
                        <td className="text-muted">{sol.fecha}</td>
                        <td>
                          <span className={`badge ${sol.estadoClase}`}>{sol.estado}</span>
                        </td>
                        <td>
                          <div className="action-cell">
                            {sol.accion === 'Ver agenda' ? (
                              <IonButton color="success" className="btn-action-table" routerLink="/admin/agenda">
                                Ver agenda
                              </IonButton>
                            ) : (
                              <IonButton color="success" className="btn-action-table">
                                {sol.accion}
                              </IonButton>
                            )}
                            <IonButton fill="outline" color="medium" className="btn-more">
                              <IonIcon icon={ellipsisHorizontal} />
                            </IonButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* --- VISTA MÓVIL: TARJETAS --- */}
              <div className="mobile-cards-container">
                <div className="mobile-tabs">
                  <button className="mobile-tab active">Pendientes</button>
                  <button className="mobile-tab">En revisión</button>
                  <button className="mobile-tab">Cerradas</button>
                </div>
                
                <div className="mobile-card">
                  <div className="mobile-card-header">
                    <div className="postulante-cell">
                      <div className="avatar" style={{ backgroundColor: '#fef0c7', color: '#b45309' }}>TG</div>
                      <div>
                        <div className="postulante-nombre">Tomás Guerra</div>
                        <div className="postulante-rut">Postula por Milo - hace 2 h</div>
                      </div>
                    </div>
                    <span className="badge estado-pendiente">PENDIENTE</span>
                  </div>
                  <p className="mobile-card-detail">Vivienda: departamento - sin mascotas</p>
                  <div className="mobile-card-actions">
                    <IonButton color="success" expand="block" className="btn-action-mobile">Pasar a revisión</IonButton>
                    <IonButton fill="outline" color="dark" expand="block" className="btn-action-mobile">Ver ficha</IonButton>
                  </div>
                </div>

                <div className="mobile-card">
                  <div className="mobile-card-header">
                    <div className="postulante-cell">
                      <div className="avatar" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>CM</div>
                      <div>
                        <div className="postulante-nombre">Camila Morales</div>
                        <div className="postulante-rut">Luna - cumple requisitos</div>
                      </div>
                    </div>
                    <span className="badge estado-revision">EN REVISIÓN</span>
                  </div>
                  <p className="mobile-card-detail">RUT •• 456.789-0 - contacto protegido</p>
                  <div className="mobile-card-actions">
                    <IonButton color="success" expand="block" className="btn-action-mobile">Preseleccionar</IonButton>
                    <IonButton fill="outline" color="dark" expand="block" className="btn-action-mobile">Ver ficha</IonButton>
                  </div>
                </div>
                
                <div className="mobile-info-box">
                  <strong>Preseleccionar no aprueba la adopción</strong>
                  <p>Preselección → Horario → Entrevista → Resultado</p>
                  <p className="text-small">PatitasGo habilita horarios y evita conflictos automáticamente.</p>
                </div>
              </div>

              <div className="desktop-footer-note">
                <p><strong>Flujo: Pendiente → En revisión → Preseleccionado → Entrevista → Evaluación → Resultado</strong></p>
                <p>Si no se concreta, el refugio puede continuar con otro postulante.</p>
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
          <div className="admin-nav-item-mobile active" onClick={() => navigate('/admin/solicitudes')} style={{ cursor: 'pointer' }}>
            <IonIcon icon={documentTextOutline} />
            <span>Solicitudes</span>
          </div>
          <div className="admin-nav-item-mobile" onClick={() => navigate('/admin/animales')} style={{ cursor: 'pointer' }}>
            <IonIcon icon={pawOutline} />
            <span>Animales</span>
          </div>
          <div className="admin-nav-item-mobile" onClick={() => navigate('/admin/agenda')} style={{ cursor: 'pointer' }}>
            <IonIcon icon={personOutline} />
            <span>Agenda</span>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SolicitudesAdmin;