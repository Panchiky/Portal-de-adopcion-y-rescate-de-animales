import React from 'react';
import { IonSpinner, IonText, IonButton } from '@ionic/react';

interface EstadoCargaProps {
  cargando: boolean;
  error: string;
  onReintentar: () => void;
}

// Muestra un spinner mientras carga o el error con opción de reintentar
const EstadoCarga: React.FC<EstadoCargaProps> = ({ cargando, error, onReintentar }) => {
  if (cargando) {
    return (
      <div className="ion-text-center ion-padding">
        <IonSpinner name="crescent" color="success" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="ion-text-center ion-padding">
        <IonText color="danger"><p>{error}</p></IonText>
        <IonButton fill="outline" color="dark" onClick={onReintentar}>Reintentar</IonButton>
      </div>
    );
  }
  return null;
};

export default EstadoCarga;
