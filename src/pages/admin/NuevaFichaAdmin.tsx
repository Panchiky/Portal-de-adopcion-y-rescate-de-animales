import React, { useState } from 'react';
import { IonInput, IonSelect, IonSelectOption, IonTextarea, IonButton, IonText, IonToast, IonCheckbox, IonSpinner, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import { useParams } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { obtenerAnimal, crearAnimal, actualizarAnimal, AnimalApi, DatosAnimal, EstadoAnimal } from '../../services/animalesService';
import { mensajeError } from '../../services/api';

interface FichaForm {
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  edad: string;
  unidadEdad: 'ANIOS' | 'MESES';
  tamano: string;
  descripcion: string;
  salud: string;
  vacunado: boolean;
  esterilizado: boolean;
  fotoUrl: string;
}

type CampoTexto = 'nombre' | 'especie' | 'sexo' | 'edad' | 'tamano' | 'fotoUrl';

const FORM_INICIAL: FichaForm = {
  nombre: '', especie: '', raza: '', sexo: '', edad: '', unidadEdad: 'ANIOS', tamano: '',
  descripcion: '', salud: '', vacunado: false, esterilizado: false, fotoUrl: ''
};

const URL_VALIDA = /^https?:\/\/\S+$/i;

const aFormulario = (a: AnimalApi): FichaForm => {
  const enAnios = a.edadMeses >= 12 && a.edadMeses % 12 === 0;
  return {
    nombre: a.nombre,
    especie: a.especie,
    raza: a.raza ?? '',
    sexo: a.sexo,
    edad: String(enAnios ? a.edadMeses / 12 : a.edadMeses),
    unidadEdad: enAnios ? 'ANIOS' : 'MESES',
    tamano: a.tamano,
    descripcion: a.descripcion ?? '',
    salud: a.salud ?? '',
    vacunado: a.vacunado,
    esterilizado: a.esterilizado,
    fotoUrl: a.fotoUrl ?? ''
  };
};

// Devuelve el mensaje de error de cada campo según las mismas reglas del backend
const validar = (form: FichaForm): Partial<Record<CampoTexto, string>> => {
  const errores: Partial<Record<CampoTexto, string>> = {};
  const nombre = form.nombre.trim();
  const edad = Number(form.edad);
  const meses = form.unidadEdad === 'ANIOS' ? edad * 12 : edad;
  if (nombre.length < 2 || nombre.length > 60) errores.nombre = 'El nombre debe tener entre 2 y 60 caracteres';
  if (!form.especie) errores.especie = 'Selecciona la especie';
  if (!form.sexo) errores.sexo = 'Selecciona el sexo';
  if (form.edad.trim() === '' || !Number.isInteger(edad) || meses < 0 || meses > 360) errores.edad = 'Ingresa una edad entera (máximo 30 años)';
  if (!form.tamano) errores.tamano = 'Selecciona el tamaño';
  if (form.fotoUrl.trim() && !URL_VALIDA.test(form.fotoUrl.trim())) errores.fotoUrl = 'La foto debe ser una URL que empiece con http:// o https://';
  return errores;
};

const NuevaFichaAdmin: React.FC = () => {
  const { id } = useParams();
  const editando = id !== undefined;
  const router = useIonRouter();
  const [form, setForm] = useState<FichaForm>(FORM_INICIAL);
  const [estadoActual, setEstadoActual] = useState<EstadoAnimal>('BORRADOR');
  const [intentado, setIntentado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [guardado, setGuardado] = useState('');

  useIonViewWillEnter(() => {
    setIntentado(false);
    setError('');
    if (!editando) {
      setForm(FORM_INICIAL);
      return;
    }
    setCargando(true);
    obtenerAnimal(Number(id))
      .then((animal) => {
        setForm(aFormulario(animal.api));
        setEstadoActual(animal.status);
      })
      .catch((err) => setError(mensajeError(err)))
      .finally(() => setCargando(false));
  }, [id, editando]);

  const actualizar = <K extends keyof FichaForm>(campo: K, valor: FichaForm[K]) => setForm((f) => ({ ...f, [campo]: valor }));
  const errores = validar(form);
  const errorDe = (campo: CampoTexto) => (intentado ? errores[campo] : undefined);
  const claseCampo = (campo: CampoTexto) => `ion-margin-bottom ${errorDe(campo) ? 'ion-invalid ion-touched' : ''}`;

  const volver = () => {
    if (router.canGoBack()) router.goBack();
    else router.push('/admin/animales', 'back', 'replace');
  };

  const guardar = async (estado: EstadoAnimal) => {
    setIntentado(true);
    setError('');
    if (Object.keys(errores).length > 0) return;
    const edad = Number(form.edad);
    const datos: DatosAnimal = {
      nombre: form.nombre.trim(),
      especie: form.especie as DatosAnimal['especie'],
      raza: form.raza.trim() || null,
      sexo: form.sexo as DatosAnimal['sexo'],
      edadMeses: form.unidadEdad === 'ANIOS' ? edad * 12 : edad,
      tamano: form.tamano as DatosAnimal['tamano'],
      estado,
      descripcion: form.descripcion.trim() || null,
      salud: form.salud.trim() || null,
      vacunado: form.vacunado,
      esterilizado: form.esterilizado,
      fotoUrl: form.fotoUrl.trim() || null
    };
    setGuardando(true);
    try {
      const animal = editando ? await actualizarAnimal(Number(id), datos) : await crearAnimal(datos);
      setGuardado(estado === 'DISPONIBLE' && !editando
        ? `Ficha de ${animal.name} publicada en el catálogo`
        : `Ficha de ${animal.name} guardada`);
    } catch (err) {
      setError(mensajeError(err));
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <AdminLayout titulo="Editar ficha" volverA="/admin/animales">
        <div className="ion-text-center ion-padding"><IonSpinner name="crescent" /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout titulo={editando ? 'Editar ficha' : 'Nueva ficha'} volverA="/admin/animales">
      <h1>{editando ? `Editar ficha de ${form.nombre}` : 'Nueva ficha de animal'}</h1>
      <IonText color="medium">
        <p>{editando
          ? 'Los cambios se guardan sin modificar el estado de publicación. Los campos con * son obligatorios.'
          : 'Guárdala como borrador para completarla después o publícala de inmediato. Los campos con * son obligatorios.'}</p>
      </IonText>

      <IonInput className={claseCampo('nombre')} label="Nombre *" labelPlacement="stacked" fill="outline" value={form.nombre} maxlength={60}
        onIonInput={(e) => actualizar('nombre', e.detail.value ?? '')} errorText={errorDe('nombre')} />
      <IonSelect className={claseCampo('especie')} label="Especie *" labelPlacement="stacked" fill="outline" value={form.especie}
        onIonChange={(e) => actualizar('especie', e.detail.value)} placeholder="Selecciona" errorText={errorDe('especie')}>
        <IonSelectOption value="PERRO">Perro</IonSelectOption>
        <IonSelectOption value="GATO">Gato</IonSelectOption>
      </IonSelect>
      <IonInput className="ion-margin-bottom" label="Raza" labelPlacement="stacked" fill="outline" placeholder="Ej: Mestizo" value={form.raza} maxlength={60}
        onIonInput={(e) => actualizar('raza', e.detail.value ?? '')} />
      <IonSelect className={claseCampo('sexo')} label="Sexo *" labelPlacement="stacked" fill="outline" value={form.sexo}
        onIonChange={(e) => actualizar('sexo', e.detail.value)} placeholder="Selecciona" errorText={errorDe('sexo')}>
        <IonSelectOption value="MACHO">Macho</IonSelectOption>
        <IonSelectOption value="HEMBRA">Hembra</IonSelectOption>
      </IonSelect>
      <div style={{ display: 'flex', gap: 12 }}>
        <IonInput className={claseCampo('edad')} style={{ flex: 2 }} label="Edad aproximada *" labelPlacement="stacked" fill="outline" type="number" min={0}
          placeholder="Ej: 2" value={form.edad} onIonInput={(e) => actualizar('edad', e.detail.value ?? '')} errorText={errorDe('edad')} />
        <IonSelect className="ion-margin-bottom" style={{ flex: 1 }} label="Unidad" labelPlacement="stacked" fill="outline" value={form.unidadEdad}
          onIonChange={(e) => actualizar('unidadEdad', e.detail.value)}>
          <IonSelectOption value="ANIOS">Años</IonSelectOption>
          <IonSelectOption value="MESES">Meses</IonSelectOption>
        </IonSelect>
      </div>
      <IonSelect className={claseCampo('tamano')} label="Tamaño *" labelPlacement="stacked" fill="outline" value={form.tamano}
        onIonChange={(e) => actualizar('tamano', e.detail.value)} placeholder="Selecciona" errorText={errorDe('tamano')}>
        <IonSelectOption value="PEQUENO">Pequeño</IonSelectOption>
        <IonSelectOption value="MEDIANO">Mediano</IonSelectOption>
        <IonSelectOption value="GRANDE">Grande</IonSelectOption>
      </IonSelect>
      <IonTextarea className="ion-margin-bottom" label="Comportamiento y compatibilidad" labelPlacement="stacked" fill="outline" autoGrow maxlength={2000}
        value={form.descripcion} onIonInput={(e) => actualizar('descripcion', e.detail.value ?? '')} />
      <IonTextarea className="ion-margin-bottom" label="Salud" labelPlacement="stacked" fill="outline" autoGrow maxlength={1000}
        placeholder="Ej: Vacunas al día, desparasitado" value={form.salud} onIonInput={(e) => actualizar('salud', e.detail.value ?? '')} />
      <div className="ion-margin-bottom" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <IonCheckbox labelPlacement="end" checked={form.vacunado} onIonChange={(e) => actualizar('vacunado', e.detail.checked)}>Vacunado</IonCheckbox>
        <IonCheckbox labelPlacement="end" checked={form.esterilizado} onIonChange={(e) => actualizar('esterilizado', e.detail.checked)}>Esterilizado</IonCheckbox>
      </div>
      <IonInput className={claseCampo('fotoUrl')} label="URL de la fotografía" labelPlacement="stacked" fill="outline" type="url" maxlength={300}
        placeholder="https://..." value={form.fotoUrl} onIonInput={(e) => actualizar('fotoUrl', e.detail.value ?? '')} errorText={errorDe('fotoUrl')} />

      {intentado && Object.keys(errores).length > 0 && (
        <IonText color="danger"><p>Revisa los campos marcados antes de guardar.</p></IonText>
      )}
      {error && <IonText color="danger"><p>{error}</p></IonText>}

      {editando ? (
        <IonButton expand="block" color="success" disabled={guardando} onClick={() => guardar(estadoActual)}>
          {guardando ? <IonSpinner name="crescent" /> : 'Guardar cambios'}
        </IonButton>
      ) : (
        <>
          <IonButton expand="block" color="success" disabled={guardando} onClick={() => guardar('DISPONIBLE')}>
            {guardando ? <IonSpinner name="crescent" /> : 'Guardar y publicar'}
          </IonButton>
          <IonButton expand="block" fill="outline" color="success" disabled={guardando} onClick={() => guardar('BORRADOR')}>Guardar borrador</IonButton>
        </>
      )}
      <IonButton expand="block" fill="outline" color="dark" onClick={volver}>Cancelar</IonButton>

      <IonToast isOpen={guardado !== ''} message={guardado} duration={1500}
        onDidDismiss={() => { setGuardado(''); volver(); }} />
    </AdminLayout>
  );
};

export default NuevaFichaAdmin;
