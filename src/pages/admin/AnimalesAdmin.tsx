import React, { useState } from 'react';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonToast, IonActionSheet, IonAlert, useIonRouter } from '@ionic/react';
import { ellipsisHorizontal, searchOutline, addOutline } from 'ionicons/icons';
import { MenuLateralAdmin, BarraInferiorAdmin } from '../../components/MenuAdmin';
import EstadoCarga from '../../components/EstadoCarga';
import { obtenerAnimalesRefugio, cambiarEstadoAnimal, eliminarAnimal, textoEdad, Animal, EstadoAnimal } from '../../services/animalesService';
import { mensajeError } from '../../services/api';
import { useCarga } from '../../hooks/useCarga';
import './AnimalesAdmin.css';

const ETIQUETA_ESTADO: Record<EstadoAnimal, { texto: string; clase: string }> = {
  DISPONIBLE: { texto: 'PUBLICADO', clase: 'estado-publicado' },
  BORRADOR: { texto: 'BORRADOR', clase: 'estado-borrador' },
  RESERVADO: { texto: 'RESERVADO', clase: 'estado-reservado' },
  ADOPTADO: { texto: 'ADOPTADO', clase: 'estado-adoptado' },
  ARCHIVADO: { texto: 'ARCHIVADO', clase: 'estado-archivado' }
};

// Vacunas y esterilización al día = AL DÍA, solo una = CONTROL, ninguna = PENDIENTE
const saludAnimal = (a: Animal) => {
  if (a.api.vacunado && a.api.esterilizado) return { texto: 'AL DÍA', clase: 'salud-aldia' };
  if (a.api.vacunado || a.api.esterilizado) return { texto: 'CONTROL', clase: 'salud-control' };
  return { texto: 'PENDIENTE', clase: 'salud-pendiente' };
};

const codigoAnimal = (id: number) => `ANI-${String(id).padStart(3, '0')}`;
const cargarAnimales = () => obtenerAnimalesRefugio();

const AnimalesAdmin: React.FC = () => {
  const router = useIonRouter();
  const { datos, setDatos, cargando, error, recargar } = useCarga(cargarAnimales);
  const animales = datos ?? [];
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState<'TODOS' | EstadoAnimal>('TODOS');
  const [especie, setEspecie] = useState('TODAS');
  const [mensaje, setMensaje] = useState('');
  const [opcionesDe, setOpcionesDe] = useState<Animal | null>(null);
  const [eliminarA, setEliminarA] = useState<Animal | null>(null);

  const ESTADOS: ('TODOS' | EstadoAnimal)[] = ['TODOS', 'DISPONIBLE', 'BORRADOR', 'RESERVADO', 'ADOPTADO', 'ARCHIVADO'];
  const ESPECIES = ['TODAS', 'GATO', 'PERRO'];
  const siguiente = <T,>(lista: T[], actual: T) => lista[(lista.indexOf(actual) + 1) % lista.length];
  const texto = busqueda.trim().toLowerCase();
  const animalesVisibles = animales.filter((a) =>
    (texto === '' || `${a.name} ${a.species} ${codigoAnimal(a.id)}`.toLowerCase().includes(texto)) &&
    (estado === 'TODOS' || a.status === estado) &&
    (especie === 'TODAS' || a.api.especie === especie)
  );
  const contar = (e: EstadoAnimal) => animales.filter((a) => a.status === e).length;
  const controlPendiente = animales.filter((a) => saludAnimal(a).texto !== 'AL DÍA').length;

  const reemplazar = (actualizado: Animal) =>
    setDatos((lista) => (lista ?? []).map((a) => (a.id === actualizado.id ? actualizado : a)));

  const cambiarEstado = async (animal: Animal, nuevo: EstadoAnimal) => {
    try {
      reemplazar(await cambiarEstadoAnimal(animal.id, nuevo));
      setMensaje(`${animal.name} ahora está ${ETIQUETA_ESTADO[nuevo].texto.toLowerCase()}`);
    } catch (err) {
      setMensaje(mensajeError(err));
    }
  };

  const eliminar = async (animal: Animal) => {
    try {
      await eliminarAnimal(animal.id);
      setDatos((lista) => (lista ?? []).filter((a) => a.id !== animal.id));
      setMensaje(`Ficha de ${animal.name} eliminada`);
    } catch (err) {
      setMensaje(mensajeError(err));
    }
  };

  // Publicar deja la ficha visible en el catálogo; ocultar la devuelve a borrador
  const botonPublicar = (animal: Animal, clase: string) => {
    if (animal.status === 'BORRADOR' || animal.status === 'ARCHIVADO') {
      return <button className={clase} onClick={() => cambiarEstado(animal, 'DISPONIBLE')}>Publicar</button>;
    }
    if (animal.status === 'DISPONIBLE') {
      return <button className={clase} onClick={() => cambiarEstado(animal, 'BORRADOR')}>Ocultar</button>;
    }
    return null;
  };

  return (
    <IonPage>
      <IonContent fullscreen className="admin-content">
        <IonGrid className="admin-grid">
          <IonRow className="admin-row">
            
            {/* --- BARRA LATERAL (Desktop) --- */}
            <IonCol size="12" sizeMd="3" sizeLg="2.5" className="admin-sidebar">
              <MenuLateralAdmin activo="/admin/animales" />
            </IonCol>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <IonCol size="12" sizeMd="9" sizeLg="9.5" className="admin-main">
              
              {/* Encabezado */}
              <div className="admin-header-info">
                <div>
                  <h1 className="admin-page-title">Animales</h1>
                  <p className="admin-page-subtitle">Crea, publica y mantiene cada ficha de rescate.</p>
                </div>
                <IonButton color="success" className="btn-nueva-ficha" routerLink="/admin/animales/nuevo">
                  <IonIcon icon={addOutline} slot="start" />
                  Nueva ficha
                </IonButton>
              </div>

              {/* Tarjetas de Estadísticas */}
              <div className="stats-cards-container">
                <div className="admin-stat-card">
                  <h3>{animales.length}</h3>
                  <p>Registrados</p>
                </div>
                <div className="admin-stat-card bg-green-light">
                  <h3>{contar('DISPONIBLE')}</h3>
                  <p>Publicados</p>
                </div>
                <div className="admin-stat-card">
                  <h3>{contar('BORRADOR')}</h3>
                  <p>Borradores</p>
                </div>
                <div className="admin-stat-card bg-yellow-light">
                  <h3>{controlPendiente}</h3>
                  <p>Con control pendiente</p>
                </div>
              </div>

              {/* Filtros */}
              <div className="filters-container">
                <div className="search-bar">
                  <IonIcon icon={searchOutline} className="search-icon" />
                  <input type="text" placeholder="Buscar por nombre, especie o ID" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                </div>
                <div className="filter-buttons">
                  <button className="filter-btn" onClick={() => setEstado(siguiente(ESTADOS, estado))}>Estado: {estado === 'TODOS' ? 'Todos' : ETIQUETA_ESTADO[estado].texto}</button>
                  <button className="filter-btn" onClick={() => setEspecie(siguiente(ESPECIES, especie))}>Especie: {especie === 'TODAS' ? 'Todas' : especie}</button>
                  <button className="filter-btn text-success" onClick={() => { setBusqueda(''); setEstado('TODOS'); setEspecie('TODAS'); }}>Limpiar filtros</button>
                </div>
              </div>

              <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
              {datos && animalesVisibles.length === 0 && (
                <p className="text-muted">{animales.length === 0 ? 'Aún no hay fichas. Crea la primera con "Nueva ficha".' : 'Ningún animal coincide con los filtros.'}</p>
              )}

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
                    {animalesVisibles.map((animal) => (
                      <tr key={animal.id}>
                        <td>
                          <div className="animal-cell">
                            <img src={animal.image} alt={animal.name} className="animal-avatar" />
                            <div>
                              <div className="animal-nombre">{animal.name}</div>
                              <div className="animal-id">{codigoAnimal(animal.id)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-muted">{animal.species} · {textoEdad(animal.api.edadMeses)}</td>
                        <td>
                          <span className={`badge ${saludAnimal(animal).clase}`}>{saludAnimal(animal).texto}</span>
                        </td>
                        <td>
                          <span className={`badge ${ETIQUETA_ESTADO[animal.status].clase}`}>{ETIQUETA_ESTADO[animal.status].texto}</span>
                        </td>
                        <td>
                          <div className="action-cell">
                            <button className="btn-text-success" onClick={() => router.push(`/admin/animales/${animal.id}/editar`)}>Editar</button>
                            {botonPublicar(animal, 'btn-text-success')}
                            <IonButton fill="clear" color="medium" className="btn-more" aria-label={`Más opciones de ${animal.name}`} onClick={() => setOpcionesDe(animal)}>
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
                    <input type="text" placeholder="Buscar por nombre o especie" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                    <IonIcon icon={searchOutline} className="search-icon-end" />
                  </div>
                </div>

                <div className="mobile-tabs-scroll">
                  <button className={`mobile-tab ${estado === 'TODOS' ? 'active' : ''}`} onClick={() => setEstado('TODOS')}>Todos · {animales.length}</button>
                  <button className={`mobile-tab ${estado === 'DISPONIBLE' ? 'active' : ''}`} onClick={() => setEstado('DISPONIBLE')}>Publicados · {contar('DISPONIBLE')}</button>
                  <button className={`mobile-tab ${estado === 'BORRADOR' ? 'active' : ''}`} onClick={() => setEstado('BORRADOR')}>Borrador · {contar('BORRADOR')}</button>
                </div>
                
                {animalesVisibles.map((animal) => (
                  <div className="mobile-card" key={animal.id}>
                    <div className="mobile-card-header">
                      <div className="animal-cell">
                        <img src={animal.image} alt={animal.name} className="animal-avatar" />
                        <div>
                          <div className="animal-nombre">{animal.name}</div>
                          <div className="animal-id">{animal.species} · {textoEdad(animal.api.edadMeses)}</div>
                        </div>
                      </div>
                      <span className={`badge ${ETIQUETA_ESTADO[animal.status].clase}`}>{ETIQUETA_ESTADO[animal.status].texto}</span>
                    </div>
                    <div className="mobile-card-actions-row">
                      <button className="btn-text-success font-bold" onClick={() => router.push(`/admin/animales/${animal.id}/editar`)}>Editar</button>
                      {botonPublicar(animal, 'btn-text-success font-bold')}
                      <IonButton fill="clear" color="medium" aria-label={`Más opciones de ${animal.name}`} onClick={() => setOpcionesDe(animal)}>
                        <IonIcon icon={ellipsisHorizontal} />
                      </IonButton>
                    </div>
                  </div>
                ))}
                
                <div className="mobile-info-box">
                  <strong>{animales.length} animales registrados</strong>
                  <p>Mantén sus fichas y datos médicos actualizados para mejorar cada proceso.</p>
                  <p className="text-small">Crear, editar y eliminar desde esta vista.</p>
                </div>
              </div>

            </IonCol>
          </IonRow>
        </IonGrid>

        <IonActionSheet
          isOpen={opcionesDe !== null}
          header={opcionesDe ? `${opcionesDe.name} · ${codigoAnimal(opcionesDe.id)}` : ''}
          onDidDismiss={() => setOpcionesDe(null)}
          buttons={opcionesDe ? [
            ...(opcionesDe.status === 'DISPONIBLE' ? [{ text: 'Ver en el catálogo', handler: () => router.push(`/animales/${opcionesDe.id}`) }] : []),
            { text: 'Editar ficha', handler: () => router.push(`/admin/animales/${opcionesDe.id}/editar`) },
            ...(opcionesDe.status !== 'ARCHIVADO' ? [{ text: 'Archivar', handler: () => { cambiarEstado(opcionesDe, 'ARCHIVADO'); } }] : []),
            { text: 'Eliminar ficha', role: 'destructive', handler: () => setEliminarA(opcionesDe) },
            { text: 'Cancelar', role: 'cancel' }
          ] : []}
        />

        <IonAlert
          isOpen={eliminarA !== null}
          header="Eliminar ficha"
          message={eliminarA ? `¿Eliminar definitivamente la ficha de ${eliminarA.name}? Si tiene postulaciones, archívala en su lugar.` : ''}
          buttons={[
            { text: 'Cancelar', role: 'cancel' },
            { text: 'Eliminar', role: 'destructive', handler: () => { if (eliminarA) eliminar(eliminarA); } }
          ]}
          onDidDismiss={() => setEliminarA(null)}
        />

        <IonToast isOpen={mensaje !== ''} message={mensaje} duration={2500} onDidDismiss={() => setMensaje('')} />
      </IonContent>
      <BarraInferiorAdmin activo="/admin/animales" />
    </IonPage>
  );
};

export default AnimalesAdmin;