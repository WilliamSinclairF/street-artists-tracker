import { useEffect, useState } from 'react';

export function useUserCoords() {
  const [currentUserCoords, setCurrentUserCoords] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const [initialUserCoords, setInitialUserCoords] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

  const [error, setError] = useState<string | null>(null);

  const options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function handleSuccess(pos: { coords: { latitude: number; longitude: number } }) {
    const crd = pos.coords;
    setInitialUserCoords({ lat: crd.latitude, lng: crd.longitude });
    setCurrentUserCoords({ lat: crd.latitude, lng: crd.longitude });
  }

  function handleError(err: { code: number; message: string }) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    alert('Please enable location services to use this app.');
    setError(err.message);
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);

    return () => {
      null;
    };
  }, []);

  return { initialUserCoords, currentUserCoords, setCurrentUserCoords, error };
}
