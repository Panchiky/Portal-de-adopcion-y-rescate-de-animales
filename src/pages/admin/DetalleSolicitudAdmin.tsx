import React, { useCallback, useState } from 'react';
import { IonBadge, IonList, IonItem, IonLabel, IonText, IonButton, IonAlert, IonToast } from '@ionic/react';
import { useParams } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import EstadoCarga from '../../components/EstadoCarga';
import { obtenerPostulacion, cambiarEstadoPostulacion, ETIQUETA_ESTADO, EstadoPostulacion } from '../../services/postulacionesService';
import { mensajeError } from '../../services/api';
import { useCarga } from '../../hooks/useCarga';

const TRANSICIONES: Record<EstadoPostulacion, EstadoPostulacion[]> = {
  PENDIENTE: ['EN_REVISION', 'RECHAZADA'],
  EN_REVISION: ['ACEPTADA_EN_PROCESO', 'RECHAZADA'],
  ACEPTADA_EN_PROCESO: ['ADOPCION_COMPLETADA', 'RECHAZADA'],
  ADOPCION_COMPLETADA: [],
  RECHAZADA: []
};

const DetalleSolicitudAdmin: React.FC = () => {
  const { id } = useParams();
  const cargar = useCallback(() => obtenerPostulacion(Number(id)), [id]);
  const { datos: postulacion, setDatos, cargando, error, recargar } = useCarga(cargar);
  const [destino, setDestino] = useState<EstadoPostulacion | null>(null);
  const [mensaje, setMensaje] = useState('');

  if (!postulacion) {
    return (
      <AdminLayout titulo="Solicitud" volverA="/admin/solicitudes">
        {cargando || error
          ? <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
          : <IonText><p>No encontramos esta solicitud.</p></IonText>}
      </AdminLayout>
    );
  }

  const estado = postulacion.estado;

  const aplicarTransicion = (motivo?: string) => {
    if (!destino) return;
    if (destino === 'RECHAZADA' && (motivo?.trim().length ?? 0) < 10) {
      setMensaje('Debes ingresar un motivo de al menos 10 caracteres para rechazar');
      return false;
    }
    const nuevoEstado = destino;
    cambiarEstadoPostulacion(postulacion.id, nuevoEstado, motivo?.trim())
      .then((actualizada) => {
        setDatos(actualizada);
        setMensaje(`Solicitud actualizada a "${ETIQUETA_ESTADO[nuevoEstado].texto}"`);
      })
      .catch((err) => setMensaje(mensajeError(err)));
  };

  return (
    <AdminLayout titulo={`Solicitud de ${postulacion.postulante}`} volverA="/admin/solicitudes">
      <h1>{postulacion.postulante}</h1>
      <IonBadge color={ETIQUETA_ESTADO[estado].color}>{ETIQUETA_ESTADO[estado].texto}</IonBadge>

      <IonList inset>
        <IonItem><IonLabel><p>RUT</p><h3>{postulacion.rut}</h3></IonLabel></IonItem>
        <IonItem><IonLabel><p>Contacto</p><h3>{postulacion.postulanteEmail} • {postulacion.telefono}</h3></IonLabel></IonItem>
        <IonItem><IonLabel><p>Animal</p><h3>{postulacion.animal}</h3></IonLabel></IonItem>
        <IonItem><IonLabel><p>Fecha de envío</p><h3>{postulacion.fecha}</h3></IonLabel></IonItem>
        <IonItem><IonLabel className="ion-text-wrap"><p>Vivienda</p><h3>{postulacion.tipoVivienda} • {postulacion.comuna}</h3></IonLabel></IonItem>
        <IonItem><IonLabel className="ion-text-wrap"><p>Motivación</p><h3>{postulacion.motivacion}</h3></IonLabel></IonItem>
        {postulacion.motivoRechazo && (
          <IonItem><IonLabel className="ion-text-wrap"><p>Motivo del rechazo</p><h3>{postulacion.motivoRechazo}</h3></IonLabel></IonItem>
        )}
      </IonList>

      {TRANSICIONES[estado].length === 0 ? (
        <IonText color="medium"><p>Esta solicitud está cerrada y no admite más cambios.</p></IonText>
      ) : (
        TRANSICIONES[estado].map((siguiente) => (
          <IonButton
            key={siguiente}
            expand="block"
            color={siguiente === 'RECHAZADA' ? 'danger' : 'success'}
            fill={siguiente === 'RECHAZADA' ? 'outline' : 'solid'}
            onClick={() => setDestino(siguiente)}
          >
            {siguiente === 'RECHAZADA' ? 'Rechazar' : `Pasar a "${ETIQUETA_ESTADO[siguiente].texto}"`}
          </IonButton>
        ))
      )}

      <h3>Historial</h3>
      <IonList inset>
        {postulacion.historial.map((h, index) => (
          <IonItem key={index}>
            <IonLabel className="ion-text-wrap">
              <h3>{h.detalle}</h3>
              <p>{h.fecha}</p>
            </IonLabel>
          </IonItem>
        ))}
      </IonList>

      <IonAlert
        isOpen={destino !== null}
        header="Confirmar cambio de estado"
        message={destino ? `La solicitud pasará a "${ETIQUETA_ESTADO[destino].texto}".` : ''}
        inputs={destino === 'RECHAZADA' ? [{ name: 'motivo', type: 'textarea', placeholder: 'Motivo del rechazo (obligatorio)' }] : []}
        buttons={[
          { text: 'Cancelar', role: 'cancel' },
          { text: 'Confirmar', handler: (data) => aplicarTransicion(data?.motivo) }
        ]}
        onDidDismiss={() => setDestino(null)}
      />
      <IonToast isOpen={mensaje !== ''} message={mensaje} duration={2000} onDidDismiss={() => setMensaje('')} />
    </AdminLayout>
  );
};

export default DetalleSolicitudAdmin;
