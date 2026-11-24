import React, { useEffect, useState } from 'react';
import { IonSpinner, IonText } from '@ionic/react';
import { obtenerUbicacionRefugio, UbicacionRefugio } from '../services/animalesService';
import { mensajeError } from '../services/api';

// Mapa del refugio: la API consulta OpenStreetMap y aquí se muestra el punto en un mapa embebido.
// Si el servicio de mapas falla, la ficha del animal sigue funcionando y solo se muestra un aviso.
const MapaRefugio: React.FC<{ refugioId: number }> = ({ refugioId }) => {
  const [ubicacion, setUbicacion] = useState<UbicacionRefugio | null>(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError('');
    obtenerUbicacionRefugio(refugioId)
      .then((datos) => { if (activo) setUbicacion(datos); })
      .catch((err) => { if (activo) setError(mensajeError(err)); })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [refugioId]);

  if (cargando) return <IonSpinner name="dots" aria-label="Cargando mapa del refugio" />;
  if (error || !ubicacion) {
    return <IonText color="medium"><p>Mapa no disponible: {error || 'sin ubicación registrada'}</p></IonText>;
  }

  const { latitud: lat, longitud: lon } = ubicacion;
  const margen = ubicacion.precision === 'direccion' ? 0.005 : 0.03;
  const bbox = [lon - margen, lat - margen, lon + margen, lat + margen].map((n) => n.toFixed(5)).join(',');
  const mapa = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
  const comoLlegar = `https://www.openstreetmap.org/directions?to=${lat},${lon}#map=16/${lat}/${lon}`;

  return (
    <div>
      <iframe
        title={`Mapa de ${ubicacion.refugio}`}
        src={mapa}
        style={{ width: '100%', height: 240, border: 0, borderRadius: 16 }}
        loading="lazy"
      />
      <IonText color="medium">
        <p style={{ fontSize: 13 }}>
          {ubicacion.direccion}
          {ubicacion.precision === 'comuna' && ' (ubicación aproximada de la comuna)'}
          {' · '}
          <a href={comoLlegar} target="_blank" rel="noopener noreferrer">Cómo llegar</a>
          {' · Fuente: '}{ubicacion.fuente}
        </p>
      </IonText>
    </div>
  );
};

export default MapaRefugio;
