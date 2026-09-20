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

// Arreglo de mascotas (simulando una base de datos)
const mascotas = [
  {
    id: 1,
    nombre: 'Milo',
    tipo: 'Gato',
    edad: '1 año',
    descripcion: 'Milo es un gatito muy curioso y tranquilo. Le encanta dormir al sol durante la tarde y ronronear cuando le hacen cariño.',
    imagen: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    nombre: 'Luna',
    tipo: 'Perro',
    edad: '2 años',
    descripcion: 'Luna es muy enérgica y juguetona. Ideal para familias activas que disfrutan los paseos largos y jugar al aire libre.',
    imagen: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

const Explorar: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>PatitasGo - Explorar</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <h2 style={{ fontWeight: 'bold' }}>Encuentra a tu nuevo amigo</h2>
        <p>Estos peluditos están buscando un hogar lleno de amor.</p>

        {/* Recorremos el arreglo de mascotas para generar una tarjeta por cada una */}
        {mascotas.map((mascota) => (
          <IonCard key={mascota.id}>
            <img alt={`Foto de ${mascota.nombre}`} src={mascota.imagen} />
            <IonCardHeader>
              <IonCardSubtitle>{mascota.tipo} • {mascota.edad}</IonCardSubtitle>
              <IonCardTitle>{mascota.nombre}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {mascota.descripcion}
              <IonButton expand="block" color="success" className="ion-margin-top">
                Ver perfil de {mascota.nombre}
              </IonButton>
            </IonCardContent>
          </IonCard>
        ))}

      </IonContent>
    </IonPage>
  );
};

export default Explorar;