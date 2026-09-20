import React from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonText, IonItem, IonLabel } from '@ionic/react';
import './Login.css'; // Reutilizamos el CSS del login para mantener el formato

const CrearCuenta: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <div className="login-container">
          <div className="login-form">
            <IonText color="dark">
              <h2 style={{ fontWeight: 'bold' }}>Crea tu cuenta</h2>
              <p>Encuentra, adopta y acompaña una nueva historia.</p>
            </IonText>

            <IonItem lines="none" className="input-item">
              <IonLabel position="stacked">Nombre completo</IonLabel>
              <IonInput type="text" placeholder="Ej: Tomás Guerra" />
            </IonItem>

            <IonItem lines="none" className="input-item">
              <IonLabel position="stacked">Correo electrónico</IonLabel>
              <IonInput type="email" placeholder="tomas@ejemplo.cl" />
            </IonItem>

            <IonItem lines="none" className="input-item">
              <IonLabel position="stacked">Contraseña</IonLabel>
              <IonInput type="password" placeholder="••••••••" />
            </IonItem>

            <IonButton expand="block" color="success" className="ion-margin-top">
              Crear cuenta
            </IonButton>

            <div className="ion-text-center ion-margin-top">
              <IonButton routerLink="/login" fill="clear" color="dark">
                ¿Ya tienes cuenta? Inicia sesión
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CrearCuenta;