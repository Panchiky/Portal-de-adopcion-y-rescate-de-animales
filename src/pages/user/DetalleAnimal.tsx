import React, { useCallback, useState } from 'react';
import { IonButton, IonIcon, IonChip, IonLabel, IonText, IonToast } from '@ionic/react';
import { heart, heartOutline } from 'ionicons/icons';
import { useParams, useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../components/UsuarioLayout';
import EstadoCarga from '../../components/EstadoCarga';
import { obtenerAnimal, obtenerFavoritos, agregarFavorito, quitarFavorito, ubicacionAnimal } from '../../services/animalesService';
import { estaAutenticado, obtenerRol } from '../../services/authService';
import { mensajeError } from '../../services/api';
import { useCarga } from '../../hooks/useCarga';

const DetalleAnimal: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const cargar = useCallback(async () => {
    const esUsuario = estaAutenticado() && obtenerRol() === 'user';
    const [animal, favoritos] = await Promise.all([obtenerAnimal(Number(id)), esUsuario ? obtenerFavoritos() : Promise.resolve([])]);
    return { animal, favorito: favoritos.some((f) => f.id === animal.id) };
  }, [id]);
  const { datos, setDatos, cargando, error, recargar } = useCarga(cargar);
  const [mensaje, setMensaje] = useState('');

  if (cargando) {
    return (
      <UsuarioLayout titulo="Cargando" volverA="/catalogo">
        <EstadoCarga cargando={cargando} error="" onReintentar={recargar} />
      </UsuarioLayout>
    );
  }

  if (!datos) {
    return (
      <UsuarioLayout titulo="Animal no encontrado" volverA="/catalogo">
        <IonText><p>{error || 'El animal que buscas no existe o ya no está publicado.'}</p></IonText>
        <IonButton routerLink="/catalogo">Volver a explorar</IonButton>
      </UsuarioLayout>
    );
  }

  const { animal, favorito } = datos;

  const handleFavorito = async () => {
    if (!estaAutenticado()) {
      navigate('/login', { state: { from: `/animales/${animal.id}` } });
      return;
    }
    if (obtenerRol() !== 'user') {
      setMensaje('Los favoritos están disponibles para cuentas de usuario');
      return;
    }
    try {
      if (favorito) {
        await quitarFavorito(animal.id);
      } else {
        await agregarFavorito(animal.id);
      }
      setDatos({ animal, favorito: !favorito });
      setMensaje(favorito ? `${animal.name} se quitó de tus favoritos` : `${animal.name} se agregó a tus favoritos`);
    } catch (err) {
      setMensaje(mensajeError(err));
    }
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
      <IonText color="medium"><p>{ubicacionAnimal(animal)}</p></IonText>
      <h3>Salud</h3>
      <IonText color="medium"><p>{animal.api.salud || 'Sin información de salud registrada.'}</p></IonText>

      {animal.status === 'DISPONIBLE' && (
        <IonButton expand="block" color="success" routerLink={`/animales/${animal.id}/postular`}>
          Postular para adoptar
        </IonButton>
      )}
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
