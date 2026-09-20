import React from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonText, IonItem, IonLabel, IonGrid, IonRow, IonCol } from '@ionic/react';
import './Login.css'; 

const Login: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen className="login-content">
        <IonGrid className="login-grid">
          <IonRow className="login-row">
            
            {/* COLUMNA IZQUIERDA - Informativa (Se oculta en celulares) */}
            <IonCol size="12" sizeMd="6" className="left-column">
              <div className="left-content">
                <div className="logo">
                  <span className="dot"></span> PatitasGo
                </div>
                
                <IonText className="hero-text">
                  <h1 className="main-title">Una historia nueva<br/>comienza con un<br/>encuentro.</h1>
                  <p className="subtitle">Adopta de forma informada y acompaña a refugios que transforman vidas.</p>
                </IonText>

                <div className="hero-image-container">
                  <img 
                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Gato adoptado" 
                    className="dog-image"
                  />
                </div>

                <div className="stats-container">
                  <div className="stat-box">
                    <h3>26</h3>
                    <p>Animales disponibles</p>
                  </div>
                  <div className="stat-box">
                    <h3>18</h3>
                    <p>Historias felices</p>
                  </div>
                  <div className="stat-box">
                    <h3>4</h3>
                    <p>Refugios activos</p>
                  </div>
                </div>
              </div>
            </IonCol>

            {/* COLUMNA DERECHA - Formulario */}
            <IonCol size="12" sizeMd="6" className="right-column">
              <div className="form-wrapper">
                <div className="login-form">
                  <IonText color="dark">
                    <h2 className="form-title">Bienvenido de vuelta</h2>
                    <p className="form-subtitle">Ingresa para continuar en PatitasGo.</p>
                  </IonText>

                  <IonItem lines="none" className="input-item">
                    <IonLabel position="stacked">Correo electrónico</IonLabel>
                    <IonInput type="email" placeholder="tomas@ejemplo.cl" />
                  </IonItem>

                  <IonItem lines="none" className="input-item">
                    <IonLabel position="stacked">Contraseña</IonLabel>
                    <IonInput type="password" placeholder="••••••••" />
                  </IonItem>

                  <div className="forgot-password">
                    <a href="#">¿Olvidaste tu contraseña?</a>
                  </div>

                  <IonButton expand="block" color="success" className="btn-ingresar" routerLink="/catalogo">
                    Ingresar
                  </IonButton>

                  <IonButton expand="block" fill="outline" color="dark" className="btn-google">
                    Continuar con Google
                  </IonButton>

                  <div className="ion-text-center register-link">
                    <IonButton routerLink="/registro" fill="clear" color="medium" size="small">
                      ¿Aún no tienes cuenta? Crear cuenta
                    </IonButton>
                  </div>

                  <div className="privacy-box">
                    <strong>Privacidad por diseño</strong>
                    <p>Tus datos personales solo se comparten con el refugio al enviar una postulación.</p>
                  </div>
                </div>
              </div>
            </IonCol>

          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;