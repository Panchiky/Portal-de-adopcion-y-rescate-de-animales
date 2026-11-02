import React from 'react';
import { IonText, IonButton } from '@ionic/react';
import UsuarioLayout from '../../components/UsuarioLayout';
import AnimalCard from '../../components/AnimalCard';
import EstadoCarga from '../../components/EstadoCarga';
import { obtenerFavoritos } from '../../services/animalesService';
import { useCarga } from '../../hooks/useCarga';

const Favoritos: React.FC = () => {
  const { datos: animales, cargando, error, recargar } = useCarga(obtenerFavoritos);

  return (
    <UsuarioLayout titulo="Mis favoritos" volverA="/usuario/perfil">
      <h1>Mis favoritos</h1>
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
      {animales && (animales.length === 0 ? (
        <>
          <IonText color="medium"><p>Aún no guardas animales. Usa “Añadir a favoritos” en la ficha de un animal.</p></IonText>
          <IonButton routerLink="/catalogo" color="success">Explorar animales</IonButton>
        </>
      ) : (
        animales.map((animal) => <AnimalCard key={animal.id} animal={animal} />)
      ))}
    </UsuarioLayout>
  );
};

export default Favoritos;
