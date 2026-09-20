import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonText, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonCheckbox } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import './CrearCuenta.css'; 

const CrearCuenta: React.FC = () => {
  const navigate = useNavigate();
  
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !email || !password || !confirmPassword || !aceptaTerminos) {
      alert('Por favor, completa todos los campos y acepta los términos para continuar.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    // Si todo está bien, lo enviamos al catálogo
    navigate('/catalogo');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="register-content">
        <IonGrid className="register-grid">
          <IonRow className="register-row">
            
            {/* COLUMNA IZQUIERDA - Informativa (Fondo oscuro) */}
            <IonCol size="12" sizeMd="6" className="register-left-column">
              <div className="register-left-content">
                <div className="register-logo">
                  <span className="dot-light"></span> PatitasGo
                </div>
                
                <IonText className="register-hero-text">
                  <h1 className="register-main-title">Crea un perfil,<br/>encuentra tu match<br/>y postula con claridad.</h1>
                  <p className="register-subtitle">Un flujo simple, responsable y transparente.</p>
                </IonText>

                <div className="register-image-container">
                  <img 
                    src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Gatito buscando hogar" 
                    className="register-cat-image"
                  />
                </div>

                <div className="badge-adopcion">
                  ADOPCIÓN RESPONSABLE
                </div>
              </div>
            </IonCol>

            {/* COLUMNA DERECHA - Formulario */}
            <IonCol size="12" sizeMd="6" className="register-right-column">
              <div className="register-form-wrapper">
                <form className="register-form" onSubmit={handleRegister}>
                  <IonText color="dark">
                    <h2 className="register-form-title">Crear cuenta</h2>
                    <p className="register-form-subtitle">Completa tus datos para comenzar.</p>
                  </IonText>

                  <IonItem lines="none" className="register-input-item">
                    <IonLabel position="stacked">Nombre completo</IonLabel>
                    <IonInput 
                      type="text" 
                      placeholder="Tomás Guerra" 
                      value={nombre}
                      onIonInput={(e) => setNombre(e.detail.value!)}
                    />
                  </IonItem>

                  <IonItem lines="none" className="register-input-item">
                    <IonLabel position="stacked">Correo electrónico</IonLabel>
                    <IonInput 
                      type="email" 
                      placeholder="tomas@ejemplo.cl" 
                      value={email}
                      onIonInput={(e) => setEmail(e.detail.value!)}
                    />
                  </IonItem>

                  <IonItem lines="none" className="register-input-item">
                    <IonLabel position="stacked">Contraseña</IonLabel>
                    <IonInput 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onIonInput={(e) => setPassword(e.detail.value!)}
                    />
                  </IonItem>

                  <IonItem lines="none" className="register-input-item">
                    <IonLabel position="stacked">Confirmar contraseña</IonLabel>
                    <IonInput 
                      type="password" 
                      placeholder="••••••••" 
                      value={confirmPassword}
                      onIonInput={(e) => setConfirmPassword(e.detail.value!)}
                    />
                  </IonItem>

                  {/* Validaciones visuales */}
                  <div className="password-hints">
                    <span>✓ 8 caracteres</span>
                    <span>✓ una mayúscula</span>
                    <span>✓ un número</span>
                  </div>

                  {/* Checkbox de términos */}
                  <IonItem lines="none" className="checkbox-item">
                    <IonCheckbox 
                      color="success" 
                      checked={aceptaTerminos}
                      onIonChange={(e) => setAceptaTerminos(e.detail.checked)}
                      justify="start"
                    >
                      Acepto términos de uso y política de privacidad.
                    </IonCheckbox>
                  </IonItem>

                  <IonButton type="submit" expand="block" color="success" className="btn-crear-cuenta">
                    Crear cuenta
                  </IonButton>

                  <div className="ion-text-center login-link">
                    <IonButton routerLink="/login" fill="clear" color="medium" size="small">
                      ¿Ya tienes cuenta? Inicia sesión
                    </IonButton>
                  </div>

                  <div className="protected-data-box">
                    <strong>Datos protegidos</strong>
                    <p>Puedes actualizar o eliminar tu perfil cuando lo necesites.</p>
                  </div>
                </form>
              </div>
            </IonCol>

          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default CrearCuenta;