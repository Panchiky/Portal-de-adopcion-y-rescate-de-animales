import { useCallback, useState } from 'react';
import { useIonViewWillEnter } from '@ionic/react';
import { mensajeError } from '../services/api';

// Carga datos de la API cada vez que la pantalla se muestra y expone estado de carga y error
export function useCarga<T>(cargar: () => Promise<T>) {
  const [datos, setDatos] = useState<T | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const recargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      setDatos(await cargar());
    } catch (err) {
      setError(mensajeError(err));
    } finally {
      setCargando(false);
    }
  }, [cargar]);

  useIonViewWillEnter(() => {
    recargar();
  }, [recargar]);

  return { datos, setDatos, cargando, error, recargar };
}
