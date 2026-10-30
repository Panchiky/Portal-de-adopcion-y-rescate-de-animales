import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, IonList, IonItem, IonLabel, IonBadge, IonText } from '@ionic/react';
import { obtenerAnimales } from '../../services/animalesService';

const Refugios: React.FC = () => {
  const animales = obtenerAnimales();
  const refugios = Array.from(new Set(animales.map((a) => a.shelter))).map((nombre) => {
    const delRefugio = animales.filter((a) => a.shelter === nombre);
    return { nombre, comuna: delRefugio[0].location, disponibles: delRefugio.filter((a) => a.status === 'DISPONIBLE').length };
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" text="" />
          </IonButtons>
          <IonTitle>Refugios y organizaciones</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <IonText color="medium">
            <p>Refugios que publican animales en PatitasGo. La dirección exacta se comparte solo al coordinar una entrevista.</p>
          </IonText>
          <IonList inset>
            {refugios.map((r) => (
              <IonItem key={r.nombre} button detail routerLink="/catalogo">
                <IonLabel>
                  <h2>{r.nombre}</h2>
                  <p>{r.comuna}, Región de Valparaíso</p>
                </IonLabel>
                <IonBadge slot="end" color="success">{r.disponibles} disponibles</IonBadge>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Refugios;
