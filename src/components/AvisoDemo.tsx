import React from 'react';
import { IonIcon, IonText } from '@ionic/react';
import { flaskOutline } from 'ionicons/icons';

interface AvisoDemoProps {
  children: React.ReactNode;
}

// Marca visible para las funciones que todavía no están conectadas al backend (fase siguiente)
const AvisoDemo: React.FC<AvisoDemoProps> = ({ children }) => (
  <div
    role="note"
    style={{
      display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 14px', margin: '0 0 16px',
      borderRadius: 12, background: '#fff7ed', border: '1px solid #fdba74', color: '#9a3412'
    }}
  >
    <IonIcon icon={flaskOutline} style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }} />
    <IonText>
      <p style={{ margin: 0, fontSize: 14 }}>
        <strong>Demo · Próximamente.</strong> {children}
      </p>
    </IonText>
  </div>
);

export default AvisoDemo;
