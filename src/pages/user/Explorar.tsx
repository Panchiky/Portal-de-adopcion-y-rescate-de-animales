import React from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle,
  IonCardContent,
  IonButton
} from '@ionic/react';

const Explorar: React.FC = () => {
  return (
    <IonPage>
      {/* Barra de navegación superior */}
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>PatitasGo - Explorar</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <h2 style={{ fontWeight: 'bold' }}>Encuentra a tu nuevo amigo</h2>
        <p>Estos peluditos están buscando un hogar lleno de amor.</p>

        {/* Tarjeta de ejemplo de un gatito */}
        <IonCard>
          <img alt="Gatito de ejemplo" src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" />
          <IonCardHeader>
            <IonCardSubtitle>Gato • 1 año</IonCardSubtitle>
            <IonCardTitle>Milo</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Milo es un gatito muy curioso y tranquilo. Le encanta dormir al sol durante la tarde y ronronear cuando le hacen cariño.
            <IonButton expand="block" color="success" className="ion-margin-top">
              Ver perfil completo
            </IonButton>
          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Explorar;