import React from 'react';
import { IonList, IonItem, IonLabel, IonBadge, IonText } from '@ionic/react';
import UsuarioLayout from '../../components/UsuarioLayout';
import EstadoCarga from '../../components/EstadoCarga';
import { obtenerAlertas, marcarAlertaLeida, Alerta } from '../../services/alertasService';
import { useCarga } from '../../hooks/useCarga';

const Alertas: React.FC = () => {
  const { datos: alertas, setDatos, cargando, error, recargar } = useCarga(obtenerAlertas);

  const abrir = (alerta: Alerta) => {
    if (alerta.leida) return;
    setDatos((prev) => prev && prev.map((a) => (a.id === alerta.id ? { ...a, leida: true } : a)));
    marcarAlertaLeida(alerta.id).catch(() => undefined);
  };

  return (
    <UsuarioLayout titulo="Alertas">
      <h1>Alertas</h1>
      <IonText color="medium"><p>Cambios de estado de tus postulaciones y avisos de la cuenta.</p></IonText>
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
      {alertas && alertas.length === 0 && <IonText color="medium"><p>No tienes alertas por ahora.</p></IonText>}
      {alertas && alertas.length > 0 && (
        <IonList inset>
          {alertas.map((alerta) => (
            <IonItem key={alerta.id} button detail={!!alerta.ruta} routerLink={alerta.ruta} onClick={() => abrir(alerta)}>
              <IonLabel className="ion-text-wrap">
                <h2>{alerta.titulo}</h2>
                <p>{alerta.detalle}</p>
                <p>{alerta.fecha}</p>
              </IonLabel>
              {!alerta.leida && <IonBadge slot="end" color="success">Nueva</IonBadge>}
            </IonItem>
          ))}
        </IonList>
      )}
    </UsuarioLayout>
  );
};

export default Alertas;
