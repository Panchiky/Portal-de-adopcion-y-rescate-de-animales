import React from 'react';
import { IonList, IonItem, IonLabel, IonButton } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { cerrarSesion, obtenerEmail } from '../../services/authService';

const PerfilAdmin: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    cerrarSesion();
    navigate('/login', { replace: true });
  };

  return (
    <AdminLayout titulo="Perfil">
      <h1>Perfil administrativo</h1>
      <IonList inset>
        <IonItem><IonLabel><p>Correo</p><h3>{obtenerEmail()}</h3></IonLabel></IonItem>
        <IonItem><IonLabel><p>Rol</p><h3>Administrador de refugio</h3></IonLabel></IonItem>
        <IonItem><IonLabel><p>Refugio</p><h3>Huellas Felices</h3></IonLabel></IonItem>
      </IonList>
      <IonButton expand="block" color="danger" fill="outline" onClick={handleLogout}>
        Cerrar sesión
      </IonButton>
    </AdminLayout>
  );
};

export default PerfilAdmin;
