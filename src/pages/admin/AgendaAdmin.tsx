import React, { useState } from 'react';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonButton } from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { MenuLateralAdmin, BarraInferiorAdmin } from '../../components/MenuAdmin';
import './AgendaAdmin.css';

const AgendaAdmin: React.FC = () => {

  const [agenda] = useState<Record<string, { titulo: string; tipo: 'pasado' | 'hoy' | 'proximo'; bloques: { hora: string; animal: string; postulante: string; disponible: boolean; resultado?: string }[] }>>({
    'Mié 16': {
      titulo: 'Miércoles 16',
      tipo: 'pasado',
      bloques: [
        { hora: '15:00', animal: 'Rocky', postulante: 'Javier', disponible: false, resultado: 'Realizada' },
        { hora: '16:00', animal: 'Mabel', postulante: 'Paula', disponible: false, resultado: 'No asistió' },
        { hora: '17:00', animal: 'Kira', postulante: 'Diego', disponible: false, resultado: 'Adopción completada' }
      ]
    },
    'Jue 17': {
      titulo: 'Jueves 17',
      tipo: 'hoy',
      bloques: [
        { hora: '15:00', animal: 'Toby', postulante: 'Camila', disponible: false },
        { hora: '15:30', animal: 'Disponible', postulante: 'Reservable', disponible: true },
        { hora: '16:00', animal: 'Luna', postulante: 'Andrés', disponible: false },
        { hora: '16:30', animal: 'Disponible', postulante: 'Reservable', disponible: true },
        { hora: '17:00', animal: 'Max', postulante: 'Sofía', disponible: false },
        { hora: '17:30', animal: 'Disponible', postulante: 'Reservable', disponible: true },
      ]
    },
    'Vie 18': {
      titulo: 'Viernes 18',
      tipo: 'proximo',
      bloques: [
        { hora: '11:00', animal: 'Rocky', postulante: 'Javier', disponible: false },
        { hora: '11:30', animal: 'Disponible', postulante: 'Reservable', disponible: true },
        { hora: '12:00', animal: 'Disponible', postulante: 'Reservable', disponible: true }
      ]
    },
    'Sáb 19': {
      titulo: 'Sábado 19',
      tipo: 'proximo',
      bloques: [
        { hora: '10:00', animal: 'Milo', postulante: 'Tomás', disponible: false },
        { hora: '10:30', animal: 'Disponible', postulante: 'Reservable', disponible: true }
      ]
    }
  });
  const [diaSeleccionado, setDiaSeleccionado] = useState('Jue 17');
  const dia = agenda[diaSeleccionado];
  const bloques = dia.bloques;
  const entrevistas = bloques.filter((b) => !b.disponible).length;
  const disponibles = bloques.filter((b) => b.disponible).length;


  return (
    <IonPage>
      <IonContent fullscreen className="admin-content">
        <IonGrid className="admin-grid">
          <IonRow className="admin-row">
            
            {/* --- BARRA LATERAL (Desktop) --- */}
            <IonCol size="12" sizeMd="3" sizeLg="2.5" className="admin-sidebar">
              <MenuLateralAdmin activo="/admin/agenda" />
            </IonCol>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <IonCol size="12" sizeMd="9" sizeLg="9.5" className="admin-main">
              
              {/* Botón para volver a solicitudes */}
              <div className="mb-2">
                <IonButton fill="clear" color="dark" routerLink="/admin/solicitudes" className="btn-volver">
                  <IonIcon icon={arrowBackOutline} slot="start" />
                  Volver a solicitudes
                </IonButton>
              </div>

              <h4 className="overline-title">AGENDA DEL REFUGIO</h4>
              <h1 className="admin-page-title">Entrevistas · {dia.titulo}{dia.tipo === 'hoy' ? ' (hoy)' : ''}</h1>
              <p className="admin-page-subtitle">Una agenda única evita cruces entre entrevistas de distintos animales.</p>

              <div className="agenda-tabs">
                {Object.keys(agenda).map((d) => (
                  <button key={d} className={`agenda-tab ${d === diaSeleccionado ? 'active' : ''}`} onClick={() => setDiaSeleccionado(d)}>{d}</button>
                ))}
              </div>

              <div className="agenda-layout">
                <div className="agenda-list">
                  {bloques.map((bloque, index) => (
                    <div className={`agenda-row-item ${bloque.disponible ? 'disponible' : 'ocupado'}`} key={index}>
                      <span className="agenda-hora">{bloque.hora}</span>
                      <span className="agenda-animal">{bloque.animal}</span>
                      <span className="agenda-postulante">{bloque.postulante}{bloque.resultado ? ` · ${bloque.resultado}` : ''}</span>
                    </div>
                  ))}
                </div>

                <div className="agenda-summary">
                  <div className="summary-card">
                    <h3>{dia.tipo === 'pasado' ? 'Historial del día' : dia.tipo === 'hoy' ? 'Resumen del día' : 'Próximas entrevistas'}</h3>
                    <p><strong>{entrevistas}</strong> entrevistas<br/><strong>{disponibles}</strong> bloques disponibles<br/><strong>0</strong> conflictos</p>
                    <p className="summary-text">Los bloques ocupados no se muestran al siguiente postulante.</p>
                    <div className="badge-conflictos">Sin conflictos</div>
                  </div>
                </div>
              </div>

            </IonCol>
          </IonRow>
        </IonGrid>

      </IonContent>
      <BarraInferiorAdmin activo="/admin/agenda" />
    </IonPage>
  );
};

export default AgendaAdmin;