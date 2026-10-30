import React from 'react';
import { IonList, IonItem, IonLabel, IonBadge, IonText } from '@ionic/react';
import UsuarioLayout from '../../components/UsuarioLayout';
import { obtenerAlertas } from '../../services/alertasService';

const Alertas: React.FC = () => {
  const alertas = obtenerAlertas();

  return (
    <UsuarioLayout titulo="Alertas">
      <h1>Alertas</h1>
      <IonText color="medium"><p>Cambios de estado de tus postulaciones y avisos de la cuenta.</p></IonText>
      <IonList inset>
        {alertas.map((alerta) => (
          <IonItem key={alerta.id} button={!!alerta.ruta} detail={!!alerta.ruta} routerLink={alerta.ruta}>
            <IonLabel className="ion-text-wrap">
              <h2>{alerta.titulo}</h2>
              <p>{alerta.detalle}</p>
              <p>{alerta.fecha}</p>
            </IonLabel>
            {!alerta.leida && <IonBadge slot="end" color="success">Nueva</IonBadge>}
          </IonItem>
        ))}
      </IonList>
    </UsuarioLayout>
  );
};

export default Alertas;
