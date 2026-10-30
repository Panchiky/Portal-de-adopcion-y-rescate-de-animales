import React from 'react';
import { IonList, IonItem, IonLabel, IonBadge, IonText } from '@ionic/react';
import UsuarioLayout from '../../components/UsuarioLayout';
import { obtenerPostulaciones, ETIQUETA_ESTADO } from '../../services/postulacionesService';

const MisPostulaciones: React.FC = () => {
  const postulaciones = obtenerPostulaciones();

  return (
    <UsuarioLayout titulo="Mis postulaciones">
      <h1>Mis postulaciones</h1>
      <IonText color="medium"><p>Revisa el estado de cada solicitud enviada a los refugios.</p></IonText>
      <IonList inset>
        {postulaciones.map((p) => (
          <IonItem key={p.id} button detail routerLink={`/usuario/postulaciones/${p.id}`}>
            <IonLabel>
              <h2>{p.animal}</h2>
              <p>{p.refugio} • Enviada el {p.fecha}</p>
            </IonLabel>
            <IonBadge slot="end" color={ETIQUETA_ESTADO[p.estado].color}>
              {ETIQUETA_ESTADO[p.estado].texto}
            </IonBadge>
          </IonItem>
        ))}
      </IonList>
    </UsuarioLayout>
  );
};

export default MisPostulaciones;
