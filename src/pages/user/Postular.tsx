import React, { useState } from 'react';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonCheckbox, useIonRouter } from '@ionic/react';
import { chevronForwardOutline, arrowBackOutline } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import { obtenerAnimal } from '../../services/animalesService';
import { MenuLateralUsuario, BarraInferiorUsuario } from '../../components/MenuUsuario';
import './Postular.css';

const Postular: React.FC = () => {
  const [paso, setPaso] = useState(1); // 1: Datos, 2: Motivación, 3: Confirmación
  const router = useIonRouter();
  const { id } = useParams();
  const animal = obtenerAnimal(Number(id));

  return (
    <IonPage>
      <IonContent fullscreen className="explore-content">
        <IonGrid className="explore-grid">
          <IonRow className="explore-row">
            
            {/* --- BARRA LATERAL --- */}
            <IonCol size="12" sizeMd="3" sizeLg="2.5" className="sidebar">
              <MenuLateralUsuario activo="/catalogo" />
            </IonCol>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <IonCol size="12" sizeMd="9" sizeLg="9.5" className="main-content">
              <div className="postula-container">
                
                {/* --- BOTÓN PARA VOLVER A EXPLORAR --- */}
                <div style={{ marginBottom: '15px' }}>
                  <IonButton fill="clear" color="dark" onClick={() => router.goBack()} style={{ paddingLeft: 0, fontWeight: 600 }}>
                    <IonIcon icon={arrowBackOutline} slot="start" />
                    Volver a explorar
                  </IonButton>
                </div>

                <div className="postula-header">
                  <span className="overline">POSTULACIÓN DE ADOPCIÓN</span>
                  <h1 className="postula-title">Postular por {animal?.name}</h1>
                  <p className="postula-subtitle">Completa el formulario en 3 pasos para que el refugio evalúe tu solicitud.</p>
                </div>

                {/* Indicador de Pasos */}
                <div className="steps-indicator">
                  <div className={`step-item ${paso >= 1 ? 'active' : ''}`}>
                    <span className="step-num">1</span> Datos personales
                  </div>
                  <div className={`step-item ${paso >= 2 ? 'active' : ''}`}>
                    <span className="step-num">2</span> Motivación y hogar
                  </div>
                  <div className={`step-item ${paso >= 3 ? 'active' : ''}`}>
                    <span className="step-num">3</span> Confirmación
                  </div>
                </div>

                {/* Contenido según el paso */}
                <div className="form-card">
                  {paso === 1 && (
                    <div className="form-step">
                      <h3>Paso 1: Tus datos personales</h3>
                      <div className="form-grid">
                        <div className="input-group">
                          <label>Nombre y Apellido</label>
                          <input type="text" placeholder="Ej: Tomás Guerra" defaultValue="Tomás Guerra" />
                        </div>
                        <div className="input-group">
                          <label>RUT chileno</label>
                          <input type="text" placeholder="12.345.678-9" defaultValue="20.285.432-1" />
                        </div>
                        <div className="input-group">
                          <label>Correo electrónico</label>
                          <input type="email" placeholder="tomas@correo.com" defaultValue="tomas.guerra@correocl.com" />
                        </div>
                        <div className="input-group">
                          <label>Teléfono celular</label>
                          <input type="text" placeholder="+569..." defaultValue="+56912345678" />
                        </div>
                        <div className="input-group full-width">
                          <label>Domicilio / Comuna</label>
                          <input type="text" placeholder="Dirección y Comuna" defaultValue="Providencia, Región Metropolitana" />
                        </div>
                      </div>
                      <div className="form-actions">
                        <IonButton color="success" className="btn-next" onClick={() => setPaso(2)}>
                          Siguiente paso <IonIcon icon={chevronForwardOutline} slot="end" />
                        </IonButton>
                      </div>
                    </div>
                  )}

                  {paso === 2 && (
                    <div className="form-step">
                      <h3>Paso 2: Motivación y entorno</h3>
                      <div className="form-grid">
                        <div className="input-group full-width">
                          <label>¿Cuál es tu motivación para adoptar a Milo?</label>
                          <textarea rows={3} defaultValue="Quiero brindarle un hogar seguro, tiempo de calidad y compañía constante." />
                        </div>
                        <div className="input-group full-width">
                          <label>¿Qué tipo de vivienda tienes y permites mascotas?</label>
                          <input type="text" defaultValue="Departamento propio, el edificio admite mascotas sin restricciones." />
                        </div>
                      </div>
                      <div className="form-actions space-between">
                        <IonButton fill="outline" color="dark" onClick={() => setPaso(1)}>Volver</IonButton>
                        <IonButton color="success" className="btn-next" onClick={() => setPaso(3)}>
                          Siguiente paso <IonIcon icon={chevronForwardOutline} slot="end" />
                        </IonButton>
                      </div>
                    </div>
                  )}

                  {paso === 3 && (
                    <div className="form-step">
                      <h3>Paso 3: Confirmación y declaración</h3>
                      <div className="summary-box">
                        <p><strong>Animal:</strong> Milo (Gato mestizo)</p>
                        <p><strong>Refugio:</strong> Huellas Felices</p>
                        <p><strong>Postulante:</strong> Tomás Guerra (20.285.432-1)</p>
                      </div>
                      <div className="checkbox-container">
                        <IonCheckbox defaultChecked />
                        <label>Declaro que la información entregada es verídica y me comprometo a cumplir con la Ley de Tenencia Responsable.</label>
                      </div>
                      <div className="form-actions space-between">
                        <IonButton fill="outline" color="dark" onClick={() => setPaso(2)}>Volver</IonButton>
                        <IonButton color="success" className="btn-next" onClick={() => router.push(`/animales/${id}/postulacion-enviada`)}>
                          Enviar postulación definitiva
                        </IonButton>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </IonCol>

          </IonRow>
        </IonGrid>

      </IonContent>
      <BarraInferiorUsuario activo="/catalogo" />
    </IonPage>
  );
};

export default Postular;