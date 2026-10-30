import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonContent,
  IonFooter,
  IonLabel
} from '@ionic/react';
import { useLocation } from 'react-router-dom';
import './NavegacionLayout.css';

export interface ItemNavegacion {
  ruta: string;
  etiqueta: string;
  icono: string;
}

interface NavegacionLayoutProps {
  titulo: string;
  items: ItemNavegacion[];
  volverA?: string;
  children: React.ReactNode;
}

const NavegacionLayout: React.FC<NavegacionLayoutProps> = ({ titulo, items, volverA, children }) => {
  const location = useLocation();
  const estaActivo = (ruta: string) => location.pathname.startsWith(ruta);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="layout-toolbar">
          <IonButtons slot="start">
            {volverA && <IonBackButton defaultHref={volverA} text="" />}
          </IonButtons>
          <IonTitle>
            <span className="layout-logo ion-hide-md-up">{titulo}</span>
            <span className="layout-logo ion-hide-md-down"><span className="layout-logo-dot" />PatitasGo · {titulo}</span>
          </IonTitle>
          <IonButtons slot="end" className="ion-hide-md-down">
            {items.map((item) => (
              <IonButton
                key={item.ruta}
                routerLink={item.ruta}
                className={`layout-nav-web ${estaActivo(item.ruta) ? 'activo' : ''}`}
              >
                <IonIcon icon={item.icono} slot="start" />
                {item.etiqueta}
              </IonButton>
            ))}
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="layout-content">
        <div className="layout-contenedor">{children}</div>
      </IonContent>

      <IonFooter className="ion-hide-md-up">
        <IonToolbar className="layout-toolbar">
          <div className="layout-tabbar" style={{ '--columnas': items.length } as React.CSSProperties}>
            {items.map((item) => (
              <IonButton
                key={item.ruta}
                fill="clear"
                routerLink={item.ruta}
                className={`layout-tab ${estaActivo(item.ruta) ? 'activo' : ''}`}
              >
                <div className="layout-tab-contenido">
                  <IonIcon icon={item.icono} />
                  <IonLabel>{item.etiqueta}</IonLabel>
                </div>
              </IonButton>
            ))}
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default NavegacionLayout;
