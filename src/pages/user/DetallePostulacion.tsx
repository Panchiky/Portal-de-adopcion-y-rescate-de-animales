import React from 'react';
import { IonBadge, IonList, IonItem, IonLabel, IonText, IonButton } from '@ionic/react';
import { useParams } from 'react-router-dom';
import UsuarioLayout from '../../components/UsuarioLayout';
import { obtenerPostulacion, ETIQUETA_ESTADO } from '../../services/postulacionesService';

const DetallePostulacion: React.FC = () => {
  const { id } = useParams();
  const postulacion = obtenerPostulacion(Number(id));

  if (!postulacion) {
    return (
      <UsuarioLayout titulo="Postulación" volverA="/usuario/postulaciones">
        <IonText><p>No encontramos esta postulación.</p></IonText>
      </UsuarioLayout>
    );
  }

  const estado = ETIQUETA_ESTADO[postulacion.estado];

  return (
    <UsuarioLayout titulo={`Postulación por ${postulacion.animal}`} volverA="/usuario/postulaciones">
      <h1>Postulación por {postulacion.animal}</h1>
      <IonBadge color={estado.color}>{estado.texto}</IonBadge>
      <IonText color="medium"><p>{postulacion.refugio} • Enviada el {postulacion.fecha}</p></IonText>

      <h3>Seguimiento</h3>
      <IonList inset>
        {postulacion.historial.map((h, index) => (
          <IonItem key={index}>
            <IonLabel>
              <h3>{h.detalle}</h3>
              <p>{h.fecha}</p>
            </IonLabel>
          </IonItem>
        ))}
      </IonList>

      {postulacion.estado === 'ACEPTADA_EN_PROCESO' && (
        <IonText color="success">
          <p>El refugio propuso una entrevista. La coordinación de la cita se habilitará con el backend (EP2).</p>
        </IonText>
      )}

      <IonButton expand="block" fill="outline" color="dark" routerLink={`/animales/${postulacion.animalId}`}>
        Ver ficha de {postulacion.animal}
      </IonButton>
    </UsuarioLayout>
  );
};

export default DetallePostulacion;
