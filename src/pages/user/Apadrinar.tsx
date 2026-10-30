import React, { useState } from 'react';
import { IonSegment, IonSegmentButton, IonLabel, IonInput, IonButton, IonText, IonAlert } from '@ionic/react';
import { useParams, useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../components/UsuarioLayout';
import { obtenerAnimal } from '../../services/animalesService';

const MONTO_MINIMO = 3000;

const Apadrinar: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const animal = obtenerAnimal(Number(id));
  const [frecuencia, setFrecuencia] = useState<'UNICO' | 'MENSUAL'>('MENSUAL');
  const [monto, setMonto] = useState('');
  const [confirmar, setConfirmar] = useState(false);

  const montoNumero = Number(monto);
  const montoValido = Number.isInteger(montoNumero) && montoNumero >= MONTO_MINIMO;

  return (
    <UsuarioLayout titulo={`Apadrinar a ${animal?.name ?? ''}`} volverA={`/animales/${id}`}>
      <h1>Apadrinar a {animal?.name}</h1>
      <IonText color="medium">
        <p>Tu aporte ayuda a cubrir alimento y atención veterinaria. Apadrinar no crea una postulación ni da prioridad de adopción.</p>
      </IonText>

      <IonSegment value={frecuencia} onIonChange={(e) => setFrecuencia(e.detail.value as 'UNICO' | 'MENSUAL')}>
        <IonSegmentButton value="UNICO"><IonLabel>Único</IonLabel></IonSegmentButton>
        <IonSegmentButton value="MENSUAL"><IonLabel>Mensual</IonLabel></IonSegmentButton>
      </IonSegment>

      <IonInput
        className={`ion-margin-top ${monto !== '' && !montoValido ? 'ion-invalid ion-touched' : ''}`}
        type="number"
        label="Monto (CLP)"
        labelPlacement="stacked"
        fill="outline"
        placeholder={`Mínimo $${MONTO_MINIMO.toLocaleString('es-CL')}`}
        value={monto}
        onIonInput={(e) => setMonto(e.detail.value ?? '')}
        helperText={`Monto mínimo $${MONTO_MINIMO.toLocaleString('es-CL')}`}
        errorText={`Ingresa un monto entero igual o mayor a $${MONTO_MINIMO.toLocaleString('es-CL')}`}
      />

      <IonButton className="ion-margin-top" expand="block" color="success" disabled={!montoValido} onClick={() => setConfirmar(true)}>
        Continuar al pago
      </IonButton>

      <IonAlert
        isOpen={confirmar}
        header="Confirmar aporte"
        message={`Aporte ${frecuencia === 'MENSUAL' ? 'mensual' : 'único'} de $${montoNumero.toLocaleString('es-CL')} para ${animal?.name}. El pago real se conectará con un proveedor externo en la entrega final.`}
        buttons={[
          { text: 'Cancelar', role: 'cancel' },
          { text: 'Confirmar', handler: () => navigate(`/animales/${id}`) }
        ]}
        onDidDismiss={() => setConfirmar(false)}
      />
    </UsuarioLayout>
  );
};

export default Apadrinar;
