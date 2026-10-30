import React from 'react';
import { IonText, IonButton } from '@ionic/react';
import UsuarioLayout from '../../components/UsuarioLayout';
import AnimalCard from '../../components/AnimalCard';
import { obtenerAnimales, obtenerFavoritos } from '../../services/animalesService';

const Favoritos: React.FC = () => {
  const favoritos = obtenerFavoritos();
  const animales = obtenerAnimales().filter((a) => favoritos.includes(a.id));

  return (
    <UsuarioLayout titulo="Mis favoritos" volverA="/usuario/perfil">
      <h1>Mis favoritos</h1>
      {animales.length === 0 ? (
        <>
          <IonText color="medium"><p>Aún no guardas animales. Usa “Añadir a favoritos” en la ficha de un animal.</p></IonText>
          <IonButton routerLink="/catalogo" color="success">Explorar animales</IonButton>
        </>
      ) : (
        animales.map((animal) => <AnimalCard key={animal.id} animal={animal} />)
      )}
    </UsuarioLayout>
  );
};

export default Favoritos;
