import React from 'react';
import { IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonList, IonItem, IonLabel, IonBadge, IonText } from '@ionic/react';
import AdminLayout from '../../components/AdminLayout';
import EstadoCarga from '../../components/EstadoCarga';
import { obtenerPostulacionesRefugio, ETIQUETA_ESTADO } from '../../services/postulacionesService';
import { obtenerAnimalesRefugio } from '../../services/animalesService';
import { useCarga } from '../../hooks/useCarga';

const cargarResumen = async () => {
  const [postulaciones, animales] = await Promise.all([obtenerPostulacionesRefugio(), obtenerAnimalesRefugio('DISPONIBLE')]);
  return { postulaciones, publicados: animales.length };
};

const ResumenAdmin: React.FC = () => {
  const { datos, cargando, error, recargar } = useCarga(cargarResumen);
  const postulaciones = datos?.postulaciones ?? [];
  const pendientes = postulaciones.filter((p) => p.estado === 'PENDIENTE' || p.estado === 'EN_REVISION');
  const indicadores = [
    { valor: postulaciones.filter((p) => p.estado === 'PENDIENTE').length, texto: 'Pendientes', ruta: '/admin/solicitudes' },
    { valor: postulaciones.filter((p) => p.estado === 'EN_REVISION').length, texto: 'En revisión', ruta: '/admin/solicitudes' },
    { valor: postulaciones.filter((p) => p.estado === 'ACEPTADA_EN_PROCESO').length, texto: 'Entrevistas', ruta: '/admin/agenda' },
    { valor: datos?.publicados ?? 0, texto: 'Animales publicados', ruta: '/admin/animales' }
  ];

  return (
    <AdminLayout titulo="Resumen">
      <h1>Resumen del refugio</h1>
      <IonText color="medium"><p>Indicadores operativos y tareas que requieren atención.</p></IonText>
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
      <IonGrid>
        <IonRow>
          {indicadores.map((i) => (
            <IonCol size="6" sizeMd="3" key={i.texto}>
              <IonCard button routerLink={i.ruta}>
                <IonCardHeader>
                  <IonCardTitle>{i.valor}</IonCardTitle>
                  <IonCardSubtitle>{i.texto}</IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>

      <h3>Solicitudes por revisar</h3>
      <IonList inset>
        {pendientes.map((p) => (
          <IonItem key={p.id} button detail routerLink={`/admin/solicitudes/${p.id}`}>
            <IonLabel>
              <h2>{p.postulante}</h2>
              <p>{p.animal} • {p.fecha}</p>
            </IonLabel>
            <IonBadge slot="end" color={ETIQUETA_ESTADO[p.estado].color}>{ETIQUETA_ESTADO[p.estado].texto}</IonBadge>
          </IonItem>
        ))}
      </IonList>
    </AdminLayout>
  );
};

export default ResumenAdmin;
