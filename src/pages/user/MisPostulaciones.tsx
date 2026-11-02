import React from 'react';
import { IonList, IonItem, IonLabel, IonBadge, IonText, IonButton } from '@ionic/react';
import UsuarioLayout from '../../components/UsuarioLayout';
import EstadoCarga from '../../components/EstadoCarga';
import { obtenerMisPostulaciones, ETIQUETA_ESTADO } from '../../services/postulacionesService';
import { useCarga } from '../../hooks/useCarga';

const MisPostulaciones: React.FC = () => {
  const { datos: postulaciones, cargando, error, recargar } = useCarga(obtenerMisPostulaciones);

  return (
    <UsuarioLayout titulo="Mis postulaciones">
      <h1>Mis postulaciones</h1>
      <IonText color="medium"><p>Revisa el estado de cada solicitud enviada a los refugios.</p></IonText>
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
      {postulaciones && postulaciones.length === 0 && (
        <>
          <IonText color="medium"><p>Aún no has enviado postulaciones.</p></IonText>
          <IonButton routerLink="/catalogo" color="success">Explorar animales</IonButton>
        </>
      )}
      {postulaciones && postulaciones.length > 0 && (
        <IonList inset>
          {postulaciones.map((p) => (
            <IonItem key={p.id} button detail routerLink={`/usuario/postulaciones/${p.id}`}>
              <IonLabel>
                <h2>{p.animal}</h2>
                <p>{p.refugio} • Enviada el {p.fecha}</p>
              </IonLabel>
              <IonBadge slot="end" color={ETIQUETA_ESTADO[p.estado].color}>
                {ETIQUETA_ESTADO[p.estado].texto}
              </IonBadge>
            </IonItem>
          ))}
        </IonList>
      )}
    </UsuarioLayout>
  );
};

export default MisPostulaciones;
