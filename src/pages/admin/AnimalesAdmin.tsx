import React, { useState } from 'react';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonToast } from '@ionic/react';
import { ellipsisHorizontal, searchOutline, addOutline } from 'ionicons/icons';
import { MenuLateralAdmin, BarraInferiorAdmin } from '../../components/MenuAdmin';
import './AnimalesAdmin.css';

const AnimalesAdmin: React.FC = () => {

  const [animales] = useState([
    { id: 'ANI-026', nombre: 'Milo', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&q=80', especie: 'Gato', edad: '2 años', salud: 'AL DÍA', saludClase: 'salud-aldia', estado: 'PUBLICADO', estadoClase: 'estado-publicado' },
    { id: 'ANI-025', nombre: 'Luna', img: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=100&q=80', especie: 'Gato', edad: '8 años', salud: 'AL DÍA', saludClase: 'salud-aldia', estado: 'PUBLICADO', estadoClase: 'estado-publicado' },
    { id: 'ANI-024', nombre: 'Mabel', img: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=100&q=80', especie: 'Gato', edad: '1 año', salud: 'PENDIENTE', saludClase: 'salud-pendiente', estado: 'BORRADOR', estadoClase: 'estado-borrador' },
    { id: 'ANI-023', nombre: 'Kira', img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=100&q=80', especie: 'Perra', edad: '4 años', salud: 'CONTROL', saludClase: 'salud-control', estado: 'PUBLICADO', estadoClase: 'estado-publicado' }
  ]);
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('TODOS');
  const [especie, setEspecie] = useState('TODAS');
  const [mensaje, setMensaje] = useState('');

  const ESTADOS = ['TODOS', 'PUBLICADO', 'BORRADOR'];
  const ESPECIES = ['TODAS', 'GATO', 'PERRO'];
  const siguiente = (lista: string[], actual: string) => lista[(lista.indexOf(actual) + 1) % lista.length];
  const texto = busqueda.trim().toLowerCase();
  const animalesVisibles = animales.filter((a) =>
    (texto === '' || `${a.nombre} ${a.especie} ${a.id}`.toLowerCase().includes(texto)) &&
    (estado === 'TODOS' || a.estado === estado) &&
    (especie === 'TODAS' || a.especie.toUpperCase().startsWith(especie.slice(0, 4)))
  );
  const proximamente = (accion: string, nombre: string) =>
    setMensaje(`${accion} de ${nombre}: disponible al integrar el backend (EP2).`);


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
                  <input type="text" placeholder="Buscar por nombre, especie o ID" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                </div>
                <div className="filter-buttons">
                  <button className="filter-btn" onClick={() => setEstado(siguiente(ESTADOS, estado))}>Estado: {estado === 'TODOS' ? 'Todos' : estado}</button>
                  <button className="filter-btn" onClick={() => setEspecie(siguiente(ESPECIES, especie))}>Especie: {especie === 'TODAS' ? 'Todas' : especie}</button>
                  <button className="filter-btn text-success" onClick={() => { setBusqueda(''); setEstado('TODOS'); setEspecie('TODAS'); }}>Limpiar filtros</button>
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
                    {animalesVisibles.map((animal) => (
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
                            <button className="btn-text-success" onClick={() => proximamente('Edición', animal.nombre)}>Editar</button>
                            <button className="btn-text-success" onClick={() => proximamente('Historial médico', animal.nombre)}>Salud</button>
                            <IonButton fill="clear" color="medium" className="btn-more" onClick={() => proximamente('Más opciones', animal.nombre)}>
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
                  <button className={`mobile-tab ${estado === 'PUBLICADO' ? 'active' : ''}`} onClick={() => setEstado('PUBLICADO')}>Publicados · {animales.filter((a) => a.estado === 'PUBLICADO').length}</button>
                  <button className={`mobile-tab ${estado === 'BORRADOR' ? 'active' : ''}`} onClick={() => setEstado('BORRADOR')}>Borrador · {animales.filter((a) => a.estado === 'BORRADOR').length}</button>
                </div>
                
                {animalesVisibles.map((animal) => (
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
                      <button className="btn-text-success font-bold" onClick={() => proximamente('Edición', animal.nombre)}>Editar</button>
                      <button className="btn-text-success font-bold" onClick={() => proximamente('Historial médico', animal.nombre)}>Historial</button>
                      <IonButton fill="clear" color="medium" onClick={() => proximamente('Más opciones', animal.nombre)}>
                        <IonIcon icon={ellipsisHorizontal} />
                      </IonButton>
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

        <IonToast isOpen={mensaje !== ''} message={mensaje} duration={2500} onDidDismiss={() => setMensaje('')} />
      </IonContent>
      <BarraInferiorAdmin activo="/admin/animales" />
    </IonPage>
  );
};

export default AnimalesAdmin;