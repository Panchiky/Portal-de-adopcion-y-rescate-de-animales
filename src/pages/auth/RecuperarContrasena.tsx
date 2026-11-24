import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, IonInput, IonButton, IonText } from '@ionic/react';
import AvisoDemo from '../../components/AvisoDemo';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RecuperarContrasena: React.FC = () => {
  const [email, setEmail] = useState('');
  const [tocado, setTocado] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const emailValido = EMAIL_REGEX.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTocado(true);
    if (emailValido) setEnviado(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" text="" />
          </IonButtons>
          <IonTitle>Recuperar contraseña</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ maxWidth: 420, margin: '0 auto' }}>
          <AvisoDemo>
            El envío del correo de recuperación aún no está conectado: no se enviará ningún correo. Si recuerdas tu contraseña, puedes cambiarla desde tu Perfil.
          </AvisoDemo>
          {enviado ? (
            <>
              <h2>Solicitud registrada (demo)</h2>
              <IonText color="medium">
                <p>En la versión final, si existe una cuenta asociada a <strong>{email}</strong>, recibirá un enlace temporal para crear una nueva contraseña.</p>
              </IonText>
              <IonButton expand="block" routerLink="/login" color="success">Volver a iniciar sesión</IonButton>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <IonText color="medium">
                <p>Ingresa el correo de tu cuenta y te enviaremos un enlace para restablecer la contraseña.</p>
              </IonText>
              <IonInput
                className={tocado && !emailValido ? 'ion-invalid ion-touched' : ''}
                type="email"
                label="Correo electrónico"
                labelPlacement="stacked"
                fill="outline"
                placeholder="nombre@correo.cl"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value ?? '')}
                onIonBlur={() => setTocado(true)}
                errorText="Ingresa un correo válido, por ejemplo nombre@correo.cl"
              />
              <IonButton className="ion-margin-top" type="submit" expand="block" color="success">
                Enviar enlace
              </IonButton>
            </form>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RecuperarContrasena;
