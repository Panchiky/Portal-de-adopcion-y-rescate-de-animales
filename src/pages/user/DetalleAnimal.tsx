import React, { useState } from 'react';
import { IonButton, IonIcon, IonChip, IonLabel, IonText, IonToast } from '@ionic/react';
import { heart, heartOutline } from 'ionicons/icons';
import { useParams, useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../components/UsuarioLayout';
import { obtenerAnimal, esFavorito, alternarFavorito } from '../../services/animalesService';
import { estaAutenticado } from '../../services/authService';

const DetalleAnimal: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const animal = obtenerAnimal(Number(id));
  const [favorito, setFavorito] = useState(() => esFavorito(Number(id)));
  const [mensaje, setMensaje] = useState('');

  if (!animal) {
    return (
      <UsuarioLayout titulo="Animal no encontrado" volverA="/catalogo">
        <IonText><p>El animal que buscas no existe o ya no está publicado.</p></IonText>
        <IonButton routerLink="/catalogo">Volver a explorar</IonButton>
      </UsuarioLayout>
    );
  }

  const handleFavorito = () => {
    if (!estaAutenticado()) {
      navigate('/login', { state: { from: `/animales/${animal.id}` } });
      return;
    }
    const agregado = alternarFavorito(animal.id);
    setFavorito(agregado);
    setMensaje(agregado ? `${animal.name} se agregó a tus favoritos` : `${animal.name} se quitó de tus favoritos`);
  };

  return (
    <UsuarioLayout titulo={animal.name} volverA="/catalogo">
      <img src={animal.image} alt={`Fotografía de ${animal.name}`} style={{ width: '100%', maxHeight: 360, objectFit: 'cover', borderRadius: 16 }} />
      <h1>{animal.name}</h1>
      <IonText color="medium">
        <p>{animal.species} • {animal.gender} • {animal.age} • {animal.size}</p>
      </IonText>
      {animal.tags.map((tag) => (
        <IonChip key={tag} color="success"><IonLabel>{tag}</IonLabel></IonChip>
      ))}
      <p>{animal.description}</p>
      <h3>Refugio y ubicación</h3>
      <IonText color="medium"><p>{animal.shelter} • {animal.location} • {animal.distance}</p></IonText>
      <h3>Salud</h3>
      <IonText color="medium"><p>{animal.health}</p></IonText>

      <IonButton expand="block" color="success" routerLink={`/animales/${animal.id}/postular`}>
        Postular para adoptar
      </IonButton>
      <IonButton expand="block" fill="outline" color="dark" onClick={handleFavorito}>
        <IonIcon icon={favorito ? heart : heartOutline} color="danger" slot="start" />
        {favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      </IonButton>
      <IonButton expand="block" fill="outline" color="dark" routerLink={`/animales/${animal.id}/apadrinar`}>
        Apadrinar
      </IonButton>

      <IonToast isOpen={mensaje !== ''} message={mensaje} duration={2000} onDidDismiss={() => setMensaje('')} />
    </UsuarioLayout>
  );
};

export default DetalleAnimal;
