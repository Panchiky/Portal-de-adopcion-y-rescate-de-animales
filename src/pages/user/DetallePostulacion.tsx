import React, { useCallback, useState } from 'react';
import { IonBadge, IonList, IonItem, IonLabel, IonText, IonButton, IonAlert, IonToast, useIonRouter } from '@ionic/react';
import { useParams } from 'react-router-dom';
import UsuarioLayout from '../../components/UsuarioLayout';
import EstadoCarga from '../../components/EstadoCarga';
import { obtenerPostulacion, retirarPostulacion, ETIQUETA_ESTADO } from '../../services/postulacionesService';
import { mensajeError } from '../../services/api';
import { useCarga } from '../../hooks/useCarga';

const DetallePostulacion: React.FC = () => {
  const { id } = useParams();
  const router = useIonRouter();
  const cargar = useCallback(() => obtenerPostulacion(Number(id)), [id]);
  const { datos: postulacion, cargando, error, recargar } = useCarga(cargar);
  const [confirmarRetiro, setConfirmarRetiro] = useState(false);
  const [mensaje, setMensaje] = useState('');

  if (!postulacion) {
    return (
      <UsuarioLayout titulo="Postulación" volverA="/usuario/postulaciones">
        {cargando || error
          ? <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
          : <IonText><p>No encontramos esta postulación.</p></IonText>}
      </UsuarioLayout>
    );
  }

  const estado = ETIQUETA_ESTADO[postulacion.estado];

  const retirar = async () => {
    try {
      await retirarPostulacion(postulacion.id);
      // Volver con el router de Ionic para que la lista se recargue al mostrarse
      if (router.canGoBack()) router.goBack();
      else router.push('/usuario/postulaciones', 'back', 'replace');
    } catch (err) {
      setMensaje(mensajeError(err));
    }
  };

  return (
    <UsuarioLayout titulo={`Postulación por ${postulacion.animal}`} volverA="/usuario/postulaciones">
      <h1>Postulación por {postulacion.animal}</h1>
      <IonBadge color={estado.color}>{estado.texto}</IonBadge>
      <IonText color="medium"><p>{postulacion.refugio} • Enviada el {postulacion.fecha}</p></IonText>

      <h3>Seguimiento</h3>
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

      {postulacion.estado === 'ACEPTADA_EN_PROCESO' && (
        <IonText color="success">
          <p>El refugio preseleccionó tu postulación y te contactará para coordinar la entrevista.</p>
        </IonText>
      )}

      <IonButton expand="block" fill="outline" color="dark" routerLink={`/animales/${postulacion.animalId}`}>
        Ver ficha de {postulacion.animal}
      </IonButton>
      {postulacion.estado === 'PENDIENTE' && (
        <IonButton expand="block" fill="clear" color="danger" onClick={() => setConfirmarRetiro(true)}>
          Retirar postulación
        </IonButton>
      )}

      <IonAlert
        isOpen={confirmarRetiro}
        header="Retirar postulación"
        message={`Tu postulación por ${postulacion.animal} se eliminará y el refugio ya no la verá.`}
        buttons={[
          { text: 'Cancelar', role: 'cancel' },
          { text: 'Retirar', role: 'destructive', handler: () => { retirar(); } }
        ]}
        onDidDismiss={() => setConfirmarRetiro(false)}
      />
      <IonToast isOpen={mensaje !== ''} message={mensaje} duration={2500} onDidDismiss={() => setMensaje('')} />
    </UsuarioLayout>
  );
};

export default DetallePostulacion;
