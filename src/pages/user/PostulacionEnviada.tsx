import React, { useCallback } from 'react';
import { IonButton, IonIcon, IonText } from '@ionic/react';
import { checkmarkCircleOutline } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import UsuarioLayout from '../../components/UsuarioLayout';
import { obtenerAnimal } from '../../services/animalesService';
import { useCarga } from '../../hooks/useCarga';

const PostulacionEnviada: React.FC = () => {
  const { id } = useParams();
  const cargar = useCallback(() => obtenerAnimal(Number(id)), [id]);
  const { datos: animal } = useCarga(cargar);

  return (
    <UsuarioLayout titulo="Postulación enviada">
      <div className="ion-text-center ion-padding">
        <IonIcon icon={checkmarkCircleOutline} color="success" style={{ fontSize: 96 }} />
        <h1>¡Postulación enviada!</h1>
        <IonText color="medium">
          <p>
            Tu postulación por <strong>{animal?.name ?? 'el animal'}</strong> quedó en estado <strong>Pendiente</strong>.
            {animal && <> El refugio {animal.shelter} la revisará y te avisará en Alertas.</>}
          </p>
        </IonText>
        <IonButton expand="block" color="success" routerLink="/usuario/postulaciones">
          Ver mis postulaciones
        </IonButton>
        <IonButton expand="block" fill="outline" color="dark" routerLink="/catalogo">
          Seguir explorando
        </IonButton>
      </div>
    </UsuarioLayout>
  );
};

export default PostulacionEnviada;
