import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonBadge } from '@ionic/react';
import { Animal } from '../services/animalesService';

interface AnimalCardProps {
  animal: Animal;
  children?: React.ReactNode;
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal, children }) => (
  <IonCard routerLink={`/animales/${animal.id}`} button>
    <img src={animal.image} alt={`Fotografía de ${animal.name}`} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
    <IonCardHeader>
      <IonBadge color={animal.status === 'DISPONIBLE' ? 'success' : 'medium'}>{animal.status}</IonBadge>
      <IonCardTitle>{animal.name}</IonCardTitle>
      <IonCardSubtitle>{animal.species} • {animal.age} • {animal.size}</IonCardSubtitle>
    </IonCardHeader>
    <IonCardContent>
      {animal.shelter} • {animal.location} • {animal.distance}
      {children}
    </IonCardContent>
  </IonCard>
);

export default AnimalCard;
