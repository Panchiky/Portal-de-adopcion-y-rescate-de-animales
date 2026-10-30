import React, { useState } from 'react';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonToast } from '@ionic/react';
import { ellipsisHorizontal, searchOutline } from 'ionicons/icons';
import { MenuLateralAdmin, BarraInferiorAdmin } from '../../components/MenuAdmin';
import './SolicitudesAdmin.css';

const SolicitudesAdmin: React.FC = () => {

  const [solicitudes] = useState([
    { id: 1, iniciales: 'TG', colorAvatar: '#fef0c7', colorTexto: '#b45309', nombre: 'Tomás Guerra', rut: 'RUT •• 285.432-1', animal: 'Milo', fecha: '14 sep', estado: 'PENDIENTE', estadoClase: 'estado-pendiente', accion: 'Revisar' },
    { id: 2, iniciales: 'CM', colorAvatar: '#e0f2fe', colorTexto: '#0369a1', nombre: 'Camila Morales', rut: 'RUT •• 456.789-0', animal: 'Milo', fecha: '13 sep', estado: 'EN REVISIÓN', estadoClase: 'estado-revision', accion: 'Preseleccionar' },
    { id: 3, iniciales: 'JP', colorAvatar: '#dcfce7', colorTexto: '#15803d', nombre: 'Javier Pérez', rut: 'RUT •• 345.678-9', animal: 'Simón', fecha: '12 sep', estado: 'ENTREVISTA AGENDADA', estadoClase: 'estado-entrevista', accion: 'Ver agenda' },
    { id: 4, iniciales: 'AV', colorAvatar: '#fee2e2', colorTexto: '#b91c1c', nombre: 'Ana Vera', rut: 'RUT •• 234.567-8', animal: 'Milo', fecha: '11 sep', estado: 'RECHAZADA', estadoClase: 'estado-rechazada', accion: 'Revisar' }
  ]);
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('Todos');
  const [animal, setAnimal] = useState('Todos');
  const [mensaje, setMensaje] = useState('');
  const [tabMovil, setTabMovil] = useState<'Pendientes' | 'En revisión' | 'Cerradas'>('Pendientes');

  const ESTADOS = ['Todos', ...Array.from(new Set(solicitudes.map((s) => s.estado)))];
  const ANIMALES = ['Todos', ...Array.from(new Set(solicitudes.map((s) => s.animal)))];
  const siguiente = (lista: string[], actual: string) => lista[(lista.indexOf(actual) + 1) % lista.length];
  const texto = busqueda.trim().toLowerCase();
  const solicitudesVisibles = solicitudes.filter((s) =>
    (texto === '' || `${s.nombre} ${s.animal}`.toLowerCase().includes(texto)) &&
    (estado === 'Todos' || s.estado === estado) &&
    (animal === 'Todos' || s.animal === animal)
  );
  const ESTADOS_TAB = { 'Pendientes': ['PENDIENTE'], 'En revisión': ['EN REVISIÓN', 'ENTREVISTA AGENDADA'], 'Cerradas': ['RECHAZADA'] };
  const solicitudesMovil = solicitudesVisibles.filter((s) => ESTADOS_TAB[tabMovil].includes(s.estado));


  return (
    <IonPage>
      <IonContent fullscreen className="admin-content">
        <IonGrid className="admin-grid">
          <IonRow className="admin-row">
            
            {/* --- BARRA LATERAL (Desktop) --- */}
            <IonCol size="12" sizeMd="3" sizeLg="2.5" className="admin-sidebar">
              <MenuLateralAdmin activo="/admin/solicitudes" />
            </IonCol>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <IonCol size="12" sizeMd="9" sizeLg="9.5" className="admin-main">
              
              {/* Encabezado */}
              <div className="admin-header-info">
                <div>
                  <h1 className="admin-page-title">Gestión de solicitudes</h1>
                  <p className="admin-page-subtitle">Revisa antecedentes, preselecciona y deja que PatitasGo coordine los horarios.</p>
                </div>
                <IonButton fill="outline" color="dark" className="btn-export" onClick={() => setMensaje('Resumen exportado: 4 solicitudes (la descarga real se habilita con el backend en EP2).')}>
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
                  <input type="text" placeholder="Buscar por persona o animal" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                </div>
                <div className="filter-buttons">
                  <button className="filter-btn" onClick={() => setEstado(siguiente(ESTADOS, estado))}>Estado: {estado}</button>
                  <button className="filter-btn" onClick={() => setAnimal(siguiente(ANIMALES, animal))}>Animal: {animal}</button>
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
                    {solicitudesVisibles.map((sol) => (
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
                              <IonButton color="success" className="btn-action-table" routerLink={`/admin/solicitudes/${sol.id}`}>
                                {sol.accion}
                              </IonButton>
                            )}
                            <IonButton fill="outline" color="medium" className="btn-more" routerLink={`/admin/solicitudes/${sol.id}`}>
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
                  {(['Pendientes', 'En revisión', 'Cerradas'] as const).map((tab) => (
                    <button key={tab} className={`mobile-tab ${tabMovil === tab ? 'active' : ''}`} onClick={() => setTabMovil(tab)}>{tab}</button>
                  ))}
                </div>

                {solicitudesMovil.length === 0 && <p className="mobile-card-detail">No hay solicitudes en esta pestaña.</p>}

                {solicitudesMovil.map((sol) => (
                  <div className="mobile-card" key={sol.id}>
                    <div className="mobile-card-header">
                      <div className="postulante-cell">
                        <div className="avatar" style={{ backgroundColor: sol.colorAvatar, color: sol.colorTexto }}>{sol.iniciales}</div>
                        <div>
                          <div className="postulante-nombre">{sol.nombre}</div>
                          <div className="postulante-rut">Postula por {sol.animal} - {sol.fecha}</div>
                        </div>
                      </div>
                      <span className={`badge ${sol.estadoClase}`}>{sol.estado}</span>
                    </div>
                    <p className="mobile-card-detail">{sol.rut} - contacto protegido</p>
                    <div className="mobile-card-actions">
                      <IonButton color="success" expand="block" className="btn-action-mobile" routerLink={sol.accion === 'Ver agenda' ? '/admin/agenda' : `/admin/solicitudes/${sol.id}`}>{sol.accion}</IonButton>
                      <IonButton fill="outline" color="dark" expand="block" className="btn-action-mobile" routerLink={`/admin/solicitudes/${sol.id}`}>Ver ficha</IonButton>
                    </div>
                  </div>
                ))}

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

        <IonToast isOpen={mensaje !== ''} message={mensaje} duration={2500} onDidDismiss={() => setMensaje('')} />
      </IonContent>
      <BarraInferiorAdmin activo="/admin/solicitudes" />
    </IonPage>
  );
};

export default SolicitudesAdmin;