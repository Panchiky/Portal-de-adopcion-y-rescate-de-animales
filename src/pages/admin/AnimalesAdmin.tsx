import React, { useState } from 'react';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon } from '@ionic/react';
import { 
  gridOutline, 
  documentTextOutline, 
  pawOutline, 
  personOutline, 
  ellipsisHorizontal,
  searchOutline,
  addOutline
} from 'ionicons/icons';
import './AnimalesAdmin.css';

const AnimalesAdmin: React.FC = () => {
  const [animales] = useState([
    { id: 'ANI-026', nombre: 'Milo', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&q=80', especie: 'Gato', edad: '2 años', salud: 'AL DÍA', saludClase: 'salud-aldia', estado: 'PUBLICADO', estadoClase: 'estado-publicado' },
    { id: 'ANI-025', nombre: 'Luna', img: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=100&q=80', especie: 'Gato', edad: '8 años', salud: 'AL DÍA', saludClase: 'salud-aldia', estado: 'PUBLICADO', estadoClase: 'estado-publicado' },
    { id: 'ANI-024', nombre: 'Mabel', img: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=100&q=80', especie: 'Gato', edad: '1 año', salud: 'PENDIENTE', saludClase: 'salud-pendiente', estado: 'BORRADOR', estadoClase: 'estado-borrador' },
    { id: 'ANI-023', nombre: 'Kira', img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=100&q=80', especie: 'Perra', edad: '4 años', salud: 'CONTROL', saludClase: 'salud-control', estado: 'PUBLICADO', estadoClase: 'estado-publicado' }
  ]);

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
                  <div className="admin-nav-item">
                    <IonIcon icon={gridOutline} />
                    <span>Resumen</span>
                  </div>
                  <div className="admin-nav-item">
                    <IonIcon icon={documentTextOutline} />
                    <span>Solicitudes</span>
                  </div>
                  <div className="admin-nav-item active">
                    <IonIcon icon={pawOutline} />
                    <span>Animales</span>
                  </div>
                  <div className="admin-nav-item">
                    <IonIcon icon={personOutline} />
                    <span>Perfil</span>
                  </div>
                </div>
              </div>

              <div className="admin-sidebar-bottom">
                <div className="refugio-info">
                  <h4>Huellas Felices</h4>
                  <p>Administrador</p>
                  <button className="btn-logout">Cerrar sesión</button>
                </div>
              </div>
            </IonCol>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <IonCol size="12" sizeMd="9" sizeLg="9.5" className="admin-main">
              
              {/* Encabezado */}
              <div className="admin-header-info">
                <div>
                  <h1 className="admin-page-title">Animales</h1>
                  <p className="admin-page-subtitle">Crea, publica y mantiene cada ficha de rescate.</p>
                </div>
                <IonButton color="success" className="btn-nueva-ficha">
                  <IonIcon icon={addOutline} slot="start" />
                  Nueva ficha
                </IonButton>
              </div>

              {/* Tarjetas de Estadísticas */}
              <div className="stats-cards-container">
                <div className="admin-stat-card">
                  <h3>26</h3>
                  <p>Registrados</p>
                </div>
                <div className="admin-stat-card bg-green-light">
                  <h3>21</h3>
                  <p>Publicados</p>
                </div>
                <div className="admin-stat-card">
                  <h3>5</h3>
                  <p>Borradores</p>
                </div>
                <div className="admin-stat-card bg-yellow-light">
                  <h3>4</h3>
                  <p>Con control pendiente</p>
                </div>
              </div>

              {/* Filtros */}
              <div className="filters-container">
                <div className="search-bar">
                  <IonIcon icon={searchOutline} className="search-icon" />
                  <input type="text" placeholder="Buscar por nombre, especie o ID" />
                </div>
                <div className="filter-buttons">
                  <button className="filter-btn">Estado: Todos</button>
                  <button className="filter-btn">Especie: Todas</button>
                  <button className="filter-btn text-success">Más filtros</button>
                </div>
              </div>

              {/* --- VISTA DESKTOP: TABLA --- */}
              <div className="desktop-table-container">
                <table className="requests-table">
                  <thead>
                    <tr>
                      <th>ANIMAL</th>
                      <th>ESPECIE / EDAD</th>
                      <th>SALUD</th>
                      <th>ESTADO</th>
                      <th>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {animales.map((animal) => (
                      <tr key={animal.id}>
                        <td>
                          <div className="animal-cell">
                            <img src={animal.img} alt={animal.nombre} className="animal-avatar" />
                            <div>
                              <div className="animal-nombre">{animal.nombre}</div>
                              <div className="animal-id">{animal.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-muted">{animal.especie} · {animal.edad}</td>
                        <td>
                          <span className={`badge ${animal.saludClase}`}>{animal.salud}</span>
                        </td>
                        <td>
                          <span className={`badge ${animal.estadoClase}`}>{animal.estado}</span>
                        </td>
                        <td>
                          <div className="action-cell">
                            <button className="btn-text-success">Editar</button>
                            <button className="btn-text-success">Salud</button>
                            <IonButton fill="clear" color="medium" className="btn-more">
                              <IonIcon icon={ellipsisHorizontal} />
                            </IonButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mensaje de pie (Desktop) */}
              <div className="desktop-footer-note">
                <p><strong>Consejo operativo</strong></p>
                <p>Mantén fotografía, comportamiento e historial médico actualizados antes de publicar.</p>
              </div>

              {/* --- VISTA MÓVIL: TARJETAS --- */}
              <div className="mobile-cards-container">
                <div className="mobile-search-wrapper">
                  <div className="search-bar">
                    <input type="text" placeholder="Buscar por nombre o especie" />
                    <IonIcon icon={searchOutline} className="search-icon-end" />
                  </div>
                </div>

                <div className="mobile-tabs-scroll">
                  <button className="mobile-tab active">Todos · 26</button>
                  <button className="mobile-tab">Publicados · 21</button>
                  <button className="mobile-tab">Borrador · 5</button>
                </div>
                
                {animales.map((animal) => (
                  <div className="mobile-card" key={animal.id}>
                    <div className="mobile-card-header">
                      <div className="animal-cell">
                        <img src={animal.img} alt={animal.nombre} className="animal-avatar" />
                        <div>
                          <div className="animal-nombre">{animal.nombre}</div>
                          <div className="animal-id">{animal.especie} · {animal.edad}</div>
                        </div>
                      </div>
                      <span className={`badge ${animal.estadoClase}`}>{animal.estado}</span>
                    </div>
                    <div className="mobile-card-actions-row">
                      <button className="btn-text-success font-bold">Editar</button>
                      <button className="btn-text-success font-bold">Historial</button>
                      <IonIcon icon={ellipsisHorizontal} color="medium" />
                    </div>
                  </div>
                ))}
                
                <div className="mobile-info-box">
                  <strong>26 animales registrados</strong>
                  <p>Mantén sus fichas y datos médicos actualizados para mejorar cada proceso.</p>
                  <p className="text-small">Crear, editar y eliminar desde esta vista.</p>
                </div>
              </div>

            </IonCol>
          </IonRow>
        </IonGrid>

        {/* --- BARRA INFERIOR MÓVIL ADMIN --- */}
        <div className="admin-mobile-nav">
          <div className="admin-nav-item-mobile">
            <IonIcon icon={gridOutline} />
            <span>Resumen</span>
          </div>
          <div className="admin-nav-item-mobile">
            <IonIcon icon={documentTextOutline} />
            <span>Solicitudes</span>
          </div>
          <div className="admin-nav-item-mobile active">
            <IonIcon icon={pawOutline} />
            <span>Animales</span>
          </div>
          <div className="admin-nav-item-mobile">
            <IonIcon icon={personOutline} />
            <span>Perfil</span>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AnimalesAdmin;