import React from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonText, IonItem, IonLabel } from '@ionic/react';
import './Login.css';

const Login: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <div className="login-container">
          <div className="login-form">
            <IonText color="dark">
              <h2 style={{ fontWeight: 'bold' }}>Bienvenido de vuelta</h2>
              <p>Ingresa para continuar en PatitasGo.</p>
            </IonText>

            <IonItem lines="none" className="input-item">
              <IonLabel position="stacked">Correo electrónico</IonLabel>
              <IonInput type="email" placeholder="tomas@ejemplo.cl" />
            </IonItem>

            <IonItem lines="none" className="input-item">
              <IonLabel position="stacked">Contraseña</IonLabel>
              <IonInput type="password" placeholder="••••••••" />
            </IonItem>

            <IonButton expand="block" color="success" className="ion-margin-top">
              Ingresar
            </IonButton>

            <IonButton expand="block" fill="outline" color="medium" className="ion-margin-top">
              Continuar con Google
            </IonButton>

            <div className="ion-text-center ion-margin-top">
              <IonButton routerLink="/registro" fill="clear" color="dark">
                ¿No tienes cuenta? Crear cuenta
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;