import { useWithAndHeightObserver } from '@sat/hooks/useWithAndHeightObserver';
import React, { useEffect, useRef } from 'react';

type Props = { children: React.ReactNode; onResize: (width: number, height: number) => void };

const MapContainer = ({ children, onResize }: Props) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const { height, width } = useWithAndHeightObserver(mapContainerRef);

  useEffect(() => {
    onResize(width, height);
  }, [height, width, onResize]);

  return (
    <div className="col-span-2 m-2 max-h-[80vh]" ref={mapContainerRef}>
      {children}
    </div>
  );
};

export default MapContainer;
