import React, { useState } from 'react';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonToast } from '@ionic/react';
import { ellipsisHorizontal, searchOutline } from 'ionicons/icons';
import { MenuLateralAdmin, BarraInferiorAdmin } from '../../components/MenuAdmin';
import EstadoCarga from '../../components/EstadoCarga';
import { obtenerPostulacionesRefugio, ETIQUETA_ESTADO, EstadoPostulacion, Postulacion } from '../../services/postulacionesService';
import { useCarga } from '../../hooks/useCarga';
import './SolicitudesAdmin.css';

const ESTILO_ESTADO: Record<EstadoPostulacion, { clase: string; fondo: string; texto: string; accion: string }> = {
  PENDIENTE: { clase: 'estado-pendiente', fondo: '#fef0c7', texto: '#b45309', accion: 'Revisar' },
  EN_REVISION: { clase: 'estado-revision', fondo: '#e0f2fe', texto: '#0369a1', accion: 'Preseleccionar' },
  ACEPTADA_EN_PROCESO: { clase: 'estado-entrevista', fondo: '#dcfce7', texto: '#15803d', accion: 'Gestionar' },
  ADOPCION_COMPLETADA: { clase: 'estado-entrevista', fondo: '#dcfce7', texto: '#15803d', accion: 'Ver' },
  RECHAZADA: { clase: 'estado-rechazada', fondo: '#fee2e2', texto: '#b91c1c', accion: 'Ver' }
};

const iniciales = (nombre: string) => nombre.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');
// Solo se muestran los últimos dígitos del RUT para proteger el dato en el listado
const rutProtegido = (rut: string) => `RUT •• ${rut.slice(-9)}`;
const cargarSolicitudes = () => obtenerPostulacionesRefugio();

// Genera un CSV con las solicitudes visibles y lo descarga en el navegador
const exportarCsv = (solicitudes: Postulacion[]) => {
  const celda = (valor: string) => `"${valor.replace(/"/g, '""')}"`;
  const filas = [
    ['ID', 'Postulante', 'Correo', 'Animal', 'Fecha', 'Estado', 'Comuna'],
    ...solicitudes.map((s) => [String(s.id), s.postulante, s.postulanteEmail, s.animal, s.fecha, ETIQUETA_ESTADO[s.estado].texto, s.comuna])
  ];
  const csv = '﻿' + filas.map((f) => f.map(celda).join(';')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = `solicitudes-${new Date().toISOString().slice(0, 10)}.csv`;
  enlace.click();
  URL.revokeObjectURL(url);
};

const SolicitudesAdmin: React.FC = () => {
  const { datos, cargando, error, recargar } = useCarga(cargarSolicitudes);
  const solicitudes = datos ?? [];
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState<'Todos' | EstadoPostulacion>('Todos');
  const [animal, setAnimal] = useState('Todos');
  const [mensaje, setMensaje] = useState('');
  const [tabMovil, setTabMovil] = useState<'Pendientes' | 'En revisión' | 'Cerradas'>('Pendientes');

  const ESTADOS: ('Todos' | EstadoPostulacion)[] = ['Todos', ...Array.from(new Set(solicitudes.map((s) => s.estado)))];
  const ANIMALES = ['Todos', ...Array.from(new Set(solicitudes.map((s) => s.animal)))];
  const siguiente = <T,>(lista: T[], actual: T) => lista[(lista.indexOf(actual) + 1) % lista.length];
  const texto = busqueda.trim().toLowerCase();
  const solicitudesVisibles = solicitudes.filter((s) =>
    (texto === '' || `${s.postulante} ${s.animal}`.toLowerCase().includes(texto)) &&
    (estado === 'Todos' || s.estado === estado) &&
    (animal === 'Todos' || s.animal === animal)
  );
  const ESTADOS_TAB: Record<typeof tabMovil, EstadoPostulacion[]> = {
    'Pendientes': ['PENDIENTE'],
    'En revisión': ['EN_REVISION', 'ACEPTADA_EN_PROCESO'],
    'Cerradas': ['RECHAZADA', 'ADOPCION_COMPLETADA']
  };
  const solicitudesMovil = solicitudesVisibles.filter((s) => ESTADOS_TAB[tabMovil].includes(s.estado));
  const contar = (e: EstadoPostulacion) => solicitudes.filter((s) => s.estado === e).length;

  const exportar = () => {
    if (solicitudesVisibles.length === 0) {
      setMensaje('No hay solicitudes para exportar con los filtros actuales');
      return;
    }
    exportarCsv(solicitudesVisibles);
    setMensaje(`Resumen exportado: ${solicitudesVisibles.length} solicitudes`);
  };


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
                <IonButton fill="outline" color="dark" className="btn-export" onClick={exportar}>
                  Exportar resumen
                </IonButton>
              </div>

              {/* Tarjetas de Estadísticas */}
              <div className="stats-cards-container">
                <div className="admin-stat-card">
                  <h3>{contar('PENDIENTE')}</h3>
                  <p>Pendientes</p>
                </div>
                <div className="admin-stat-card bg-blue">
                  <h3>{contar('EN_REVISION')}</h3>
                  <p>En revisión</p>
                </div>
                <div className="admin-stat-card bg-green">
                  <h3>{contar('ACEPTADA_EN_PROCESO')}</h3>
                  <p>Entrevistas</p>
                </div>
                <div className="admin-stat-card bg-red">
                  <h3>{contar('RECHAZADA')}</h3>
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
                  <button className="filter-btn" onClick={() => setEstado(siguiente(ESTADOS, estado))}>Estado: {estado === 'Todos' ? 'Todos' : ETIQUETA_ESTADO[estado].texto}</button>
                  <button className="filter-btn" onClick={() => setAnimal(siguiente(ANIMALES, animal))}>Animal: {animal}</button>
                </div>
                <div className="update-label">
                  <span>Actualizado hoy</span>
                </div>
              </div>

              <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
              {datos && solicitudesVisibles.length === 0 && (
                <p className="text-muted">{solicitudes.length === 0 ? 'Aún no llegan solicitudes a tu refugio.' : 'Ninguna solicitud coincide con los filtros.'}</p>
              )}

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
                            <div className="avatar" style={{ backgroundColor: ESTILO_ESTADO[sol.estado].fondo, color: ESTILO_ESTADO[sol.estado].texto }}>
                              {iniciales(sol.postulante)}
                            </div>
                            <div>
                              <div className="postulante-nombre">{sol.postulante}</div>
                              <div className="postulante-rut">{rutProtegido(sol.rut)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-dark font-medium">{sol.animal}</td>
                        <td className="text-muted">{sol.fecha}</td>
                        <td>
                          <span className={`badge ${ESTILO_ESTADO[sol.estado].clase}`}>{ETIQUETA_ESTADO[sol.estado].texto}</span>
                        </td>
                        <td>
                          <div className="action-cell">
                            <IonButton color="success" className="btn-action-table" routerLink={`/admin/solicitudes/${sol.id}`}>
                              {ESTILO_ESTADO[sol.estado].accion}
                            </IonButton>
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
                        <div className="avatar" style={{ backgroundColor: ESTILO_ESTADO[sol.estado].fondo, color: ESTILO_ESTADO[sol.estado].texto }}>{iniciales(sol.postulante)}</div>
                        <div>
                          <div className="postulante-nombre">{sol.postulante}</div>
                          <div className="postulante-rut">Postula por {sol.animal} - {sol.fecha}</div>
                        </div>
                      </div>
                      <span className={`badge ${ESTILO_ESTADO[sol.estado].clase}`}>{ETIQUETA_ESTADO[sol.estado].texto}</span>
                    </div>
                    <p className="mobile-card-detail">{rutProtegido(sol.rut)} - contacto protegido</p>
                    <div className="mobile-card-actions">
                      <IonButton color="success" expand="block" className="btn-action-mobile" routerLink={`/admin/solicitudes/${sol.id}`}>{ESTILO_ESTADO[sol.estado].accion}</IonButton>
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