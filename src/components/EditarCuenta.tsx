import React, { useState } from 'react';
import { IonInput, IonButton, IonText, IonSpinner, IonToast, IonInputPasswordToggle, useIonViewWillEnter } from '@ionic/react';
import { obtenerPerfil, actualizarPerfil, cambiarPassword, DatosPerfil } from '../services/authService';
import { mensajeError } from '../services/api';

const TELEFONO_REGEX = /^\+?[0-9 ]{8,15}$/;
const PERFIL_VACIO: DatosPerfil = { nombre: '', apellido: '', telefono: '', comuna: '' };

// Mismas reglas que valida el backend (validaciones.js)
const validarPerfil = (p: DatosPerfil) => {
  const errores: Partial<Record<keyof DatosPerfil, string>> = {};
  if (p.nombre.trim().length < 2 || p.nombre.trim().length > 80) errores.nombre = 'Debe tener entre 2 y 80 caracteres';
  if (p.apellido.trim().length < 2 || p.apellido.trim().length > 80) errores.apellido = 'Debe tener entre 2 y 80 caracteres';
  if (p.telefono.trim() && !TELEFONO_REGEX.test(p.telefono.trim())) errores.telefono = 'Teléfono no válido, por ejemplo +56 9 1234 5678';
  if (p.comuna.trim().length > 80) errores.comuna = 'Máximo 80 caracteres';
  return errores;
};

const passwordSegura = (p: string) => p.length >= 8 && p.length <= 72 && /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p);

// Formularios para editar los datos personales (FT-07) y cambiar la contraseña (FT-08)
const EditarCuenta: React.FC = () => {
  const [perfil, setPerfil] = useState<DatosPerfil>(PERFIL_VACIO);
  const [email, setEmail] = useState('');
  const [intentoPerfil, setIntentoPerfil] = useState(false);
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);
  const [errorPerfil, setErrorPerfil] = useState('');

  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [intentoPassword, setIntentoPassword] = useState(false);
  const [guardandoPassword, setGuardandoPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState('');

  const [aviso, setAviso] = useState('');

  useIonViewWillEnter(() => {
    setIntentoPerfil(false);
    setErrorPerfil('');
    obtenerPerfil()
      .then((u) => {
        setEmail(u.email);
        setPerfil({ nombre: u.nombre, apellido: u.apellido, telefono: u.telefono ?? '', comuna: u.comuna ?? '' });
      })
      .catch((err) => setErrorPerfil(mensajeError(err)));
  });

  const erroresPerfil = validarPerfil(perfil);
  const errorDePerfil = (campo: keyof DatosPerfil) => (intentoPerfil ? erroresPerfil[campo] : undefined);
  const clasePerfil = (campo: keyof DatosPerfil) => `ion-margin-bottom ${errorDePerfil(campo) ? 'ion-invalid ion-touched' : ''}`;
  const cambiar = (campo: keyof DatosPerfil, valor: string) => setPerfil((p) => ({ ...p, [campo]: valor }));

  const guardarPerfil = async () => {
    setIntentoPerfil(true);
    setErrorPerfil('');
    if (Object.keys(erroresPerfil).length > 0) return;
    setGuardandoPerfil(true);
    try {
      await actualizarPerfil({
        nombre: perfil.nombre.trim(),
        apellido: perfil.apellido.trim(),
        telefono: perfil.telefono.trim(),
        comuna: perfil.comuna.trim()
      });
      setAviso('Datos actualizados');
    } catch (err) {
      setErrorPerfil(mensajeError(err));
    } finally {
      setGuardandoPerfil(false);
    }
  };

  const erroresPassword = {
    actual: actual ? undefined : 'Ingresa tu contraseña actual',
    nueva: !passwordSegura(nueva)
      ? 'Mínimo 8 caracteres, con mayúscula, minúscula y número'
      : nueva === actual ? 'Debe ser distinta de la contraseña actual' : undefined,
    confirmacion: confirmacion === nueva ? undefined : 'Las contraseñas no coinciden'
  };
  const errorDePassword = (campo: keyof typeof erroresPassword) => (intentoPassword ? erroresPassword[campo] : undefined);
  const clasePassword = (campo: keyof typeof erroresPassword) => `ion-margin-bottom ${errorDePassword(campo) ? 'ion-invalid ion-touched' : ''}`;

  const guardarPassword = async () => {
    setIntentoPassword(true);
    setErrorPassword('');
    if (Object.values(erroresPassword).some(Boolean)) return;
    setGuardandoPassword(true);
    try {
      await cambiarPassword(actual, nueva);
      setActual('');
      setNueva('');
      setConfirmacion('');
      setIntentoPassword(false);
      setAviso('Contraseña actualizada');
    } catch (err) {
      setErrorPassword(mensajeError(err));
    } finally {
      setGuardandoPassword(false);
    }
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <h2>Datos personales</h2>
      <IonText color="medium"><p>El correo {email && <strong>{email}</strong>} identifica tu cuenta y no se puede cambiar.</p></IonText>
      <IonInput className={clasePerfil('nombre')} label="Nombre" labelPlacement="stacked" fill="outline" maxlength={80}
        value={perfil.nombre} onIonInput={(e) => cambiar('nombre', e.detail.value ?? '')} errorText={errorDePerfil('nombre')} />
      <IonInput className={clasePerfil('apellido')} label="Apellido" labelPlacement="stacked" fill="outline" maxlength={80}
        value={perfil.apellido} onIonInput={(e) => cambiar('apellido', e.detail.value ?? '')} errorText={errorDePerfil('apellido')} />
      <IonInput className={clasePerfil('telefono')} label="Teléfono" labelPlacement="stacked" fill="outline" type="tel" placeholder="+56 9 1234 5678"
        value={perfil.telefono} onIonInput={(e) => cambiar('telefono', e.detail.value ?? '')} errorText={errorDePerfil('telefono')} />
      <IonInput className={clasePerfil('comuna')} label="Comuna" labelPlacement="stacked" fill="outline" maxlength={80}
        value={perfil.comuna} onIonInput={(e) => cambiar('comuna', e.detail.value ?? '')} errorText={errorDePerfil('comuna')} />
      {errorPerfil && <IonText color="danger"><p>{errorPerfil}</p></IonText>}
      <IonButton expand="block" color="success" disabled={guardandoPerfil} onClick={guardarPerfil}>
        {guardandoPerfil ? <IonSpinner name="crescent" /> : 'Guardar datos'}
      </IonButton>

      <h2 className="ion-margin-top">Cambiar contraseña</h2>
      <IonInput className={clasePassword('actual')} label="Contraseña actual" labelPlacement="stacked" fill="outline" type="password"
        value={actual} onIonInput={(e) => setActual(e.detail.value ?? '')} errorText={errorDePassword('actual')}>
        <IonInputPasswordToggle slot="end" />
      </IonInput>
      <IonInput className={clasePassword('nueva')} label="Contraseña nueva" labelPlacement="stacked" fill="outline" type="password"
        helperText="Mínimo 8 caracteres, con mayúscula, minúscula y número"
        value={nueva} onIonInput={(e) => setNueva(e.detail.value ?? '')} errorText={errorDePassword('nueva')}>
        <IonInputPasswordToggle slot="end" />
      </IonInput>
      <IonInput className={clasePassword('confirmacion')} label="Repite la contraseña nueva" labelPlacement="stacked" fill="outline" type="password"
        value={confirmacion} onIonInput={(e) => setConfirmacion(e.detail.value ?? '')} errorText={errorDePassword('confirmacion')}>
        <IonInputPasswordToggle slot="end" />
      </IonInput>
      {errorPassword && <IonText color="danger"><p>{errorPassword}</p></IonText>}
      <IonButton expand="block" color="success" fill="outline" disabled={guardandoPassword} onClick={guardarPassword}>
        {guardandoPassword ? <IonSpinner name="crescent" /> : 'Cambiar contraseña'}
      </IonButton>

      <IonToast isOpen={aviso !== ''} message={aviso} duration={1800} color="success" onDidDismiss={() => setAviso('')} />
    </div>
  );
};

export default EditarCuenta;
