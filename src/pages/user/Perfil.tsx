import React from 'react';
import { IonList, IonItem, IonLabel, IonIcon, IonButton, IonAvatar } from '@ionic/react';
import { heartOutline, documentTextOutline, pawOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../components/UsuarioLayout';
import { cerrarSesion, obtenerEmail } from '../../services/authService';

const Perfil: React.FC = () => {
  const navigate = useNavigate();
  const email = obtenerEmail();

  const handleLogout = () => {
    cerrarSesion();
    navigate('/login', { replace: true });
  };

  return (
    <UsuarioLayout titulo="Perfil">
      <div className="ion-text-center ion-padding">
        <IonAvatar style={{ margin: '0 auto', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IonIcon icon={pawOutline} color="success" style={{ fontSize: 32 }} />
        </IonAvatar>
        <h2>Mi cuenta</h2>
        <p>{email}</p>
      </div>
      <IonList inset>
        <IonItem button detail routerLink="/usuario/favoritos">
          <IonIcon icon={heartOutline} slot="start" />
          <IonLabel>Mis favoritos</IonLabel>
        </IonItem>
        <IonItem button detail routerLink="/usuario/postulaciones">
          <IonIcon icon={documentTextOutline} slot="start" />
          <IonLabel>Mis postulaciones</IonLabel>
        </IonItem>
      </IonList>
      <IonButton expand="block" color="danger" fill="outline" onClick={handleLogout}>
        Cerrar sesión
      </IonButton>
    </UsuarioLayout>
  );
};

export default Perfil;
