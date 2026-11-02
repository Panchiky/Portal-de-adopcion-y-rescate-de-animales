import React, { useCallback, useState } from 'react';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonCheckbox, IonText, IonSpinner, useIonRouter } from '@ionic/react';
import { chevronForwardOutline, arrowBackOutline } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import { obtenerAnimal } from '../../services/animalesService';
import { crearPostulacion } from '../../services/postulacionesService';
import { obtenerUsuario } from '../../services/sesion';
import { mensajeError } from '../../services/api';
import { useCarga } from '../../hooks/useCarga';
import EstadoCarga from '../../components/EstadoCarga';
import { MenuLateralUsuario, BarraInferiorUsuario } from '../../components/MenuUsuario';
import './Postular.css';

const RUT_REGEX = /^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/;
const TELEFONO_REGEX = /^\+?[0-9 ]{8,15}$/;

const Postular: React.FC = () => {
  const [paso, setPaso] = useState(1); // 1: Datos, 2: Motivación, 3: Confirmación
  const router = useIonRouter();
  const { id } = useParams();
  const cargar = useCallback(() => obtenerAnimal(Number(id)), [id]);
  const { datos: animal, cargando, error: errorCarga, recargar } = useCarga(cargar);
  const usuario = obtenerUsuario();

  const [rut, setRut] = useState('');
  const [telefono, setTelefono] = useState(usuario?.telefono ?? '');
  const [comuna, setComuna] = useState(usuario?.comuna ?? '');
  const [motivacion, setMotivacion] = useState('');
  const [tipoVivienda, setTipoVivienda] = useState('');
  const [otrasMascotas, setOtrasMascotas] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const avanzarDesdeDatos = () => {
    if (!RUT_REGEX.test(rut.trim())) {
      setError('Ingresa un RUT válido, por ejemplo 12.345.678-5.');
      return;
    }
    if (!TELEFONO_REGEX.test(telefono.trim())) {
      setError('Ingresa un teléfono válido, por ejemplo +56 9 1234 5678.');
      return;
    }
    if (comuna.trim().length < 2) {
      setError('Ingresa tu comuna.');
      return;
    }
    setError('');
    setPaso(2);
  };

  const avanzarDesdeMotivacion = () => {
    if (motivacion.trim().length < 20) {
      setError('Cuéntanos tu motivación en al menos 20 caracteres.');
      return;
    }
    if (tipoVivienda.trim().length < 3) {
      setError('Describe el tipo de vivienda.');
      return;
    }
    setError('');
    setPaso(3);
  };

  const enviar = async () => {
    if (!aceptaTerminos) {
      setError('Debes aceptar la declaración para enviar la postulación.');
      return;
    }
    setError('');
    setEnviando(true);
    try {
      await crearPostulacion({
        animalId: Number(id),
        rut: rut.trim(),
        telefono: telefono.trim(),
        comuna: comuna.trim(),
        tipoVivienda: tipoVivienda.trim(),
        otrasMascotas: otrasMascotas.trim() || undefined,
        motivacion: motivacion.trim(),
        aceptaTerminos,
      });
      router.push(`/animales/${id}/postulacion-enviada`);
    } catch (err) {
      setError(mensajeError(err));
    } finally {
      setEnviando(false);
    }
  };

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

                {cargando || errorCarga || !animal ? (
                  <EstadoCarga cargando={cargando} error={errorCarga} onReintentar={recargar} />
                ) : (
                <>
                <div className="postula-header">
                  <span className="overline">POSTULACIÓN DE ADOPCIÓN</span>
                  <h1 className="postula-title">Postular por {animal.name}</h1>
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
                          <input type="text" value={`${usuario?.nombre ?? ''} ${usuario?.apellido ?? ''}`.trim()} readOnly />
                        </div>
                        <div className="input-group">
                          <label>RUT chileno</label>
                          <input type="text" placeholder="12.345.678-5" value={rut} onChange={(e) => setRut(e.target.value)} />
                        </div>
                        <div className="input-group">
                          <label>Correo electrónico</label>
                          <input type="email" value={usuario?.email ?? ''} readOnly />
                        </div>
                        <div className="input-group">
                          <label>Teléfono celular</label>
                          <input type="text" placeholder="+56 9 1234 5678" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                        </div>
                        <div className="input-group full-width">
                          <label>Comuna</label>
                          <input type="text" placeholder="Ej: Viña del Mar" value={comuna} onChange={(e) => setComuna(e.target.value)} />
                        </div>
                      </div>
                      {error && <IonText color="danger"><p>{error}</p></IonText>}
                      <div className="form-actions">
                        <IonButton color="success" className="btn-next" onClick={avanzarDesdeDatos}>
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
                          <label>¿Cuál es tu motivación para adoptar a {animal.name}?</label>
                          <textarea rows={3} placeholder="Cuéntale al refugio por qué quieres adoptar (mínimo 20 caracteres)" value={motivacion} onChange={(e) => setMotivacion(e.target.value)} />
                        </div>
                        <div className="input-group">
                          <label>¿Qué tipo de vivienda tienes?</label>
                          <input type="text" placeholder="Ej: Departamento con balcón protegido" value={tipoVivienda} onChange={(e) => setTipoVivienda(e.target.value)} />
                        </div>
                        <div className="input-group">
                          <label>¿Tienes otras mascotas? (opcional)</label>
                          <input type="text" placeholder="Ej: Un gato adulto" value={otrasMascotas} onChange={(e) => setOtrasMascotas(e.target.value)} />
                        </div>
                      </div>
                      {error && <IonText color="danger"><p>{error}</p></IonText>}
                      <div className="form-actions space-between">
                        <IonButton fill="outline" color="dark" onClick={() => { setError(''); setPaso(1); }}>Volver</IonButton>
                        <IonButton color="success" className="btn-next" onClick={avanzarDesdeMotivacion}>
                          Siguiente paso <IonIcon icon={chevronForwardOutline} slot="end" />
                        </IonButton>
                      </div>
                    </div>
                  )}

                  {paso === 3 && (
                    <div className="form-step">
                      <h3>Paso 3: Confirmación y declaración</h3>
                      <div className="summary-box">
                        <p><strong>Animal:</strong> {animal.name} ({animal.species})</p>
                        <p><strong>Refugio:</strong> {animal.shelter}</p>
                        <p><strong>Postulante:</strong> {usuario?.nombre} {usuario?.apellido} ({rut})</p>
                      </div>
                      <div className="checkbox-container">
                        <IonCheckbox checked={aceptaTerminos} onIonChange={(e) => setAceptaTerminos(e.detail.checked)} />
                        <label>Declaro que la información entregada es verídica y me comprometo a cumplir con la Ley de Tenencia Responsable.</label>
                      </div>
                      {error && <IonText color="danger"><p>{error}</p></IonText>}
                      <div className="form-actions space-between">
                        <IonButton fill="outline" color="dark" onClick={() => { setError(''); setPaso(2); }}>Volver</IonButton>
                        <IonButton color="success" className="btn-next" disabled={enviando} onClick={enviar}>
                          {enviando ? <IonSpinner name="crescent" /> : 'Enviar postulación definitiva'}
                        </IonButton>
                      </div>
                    </div>
                  )}
                </div>
                </>
                )}

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
