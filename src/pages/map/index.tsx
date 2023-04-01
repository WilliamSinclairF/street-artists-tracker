import { Nav } from '@sat/components/nav/Nav';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Map from '@sat/components/map';
import MapTabs from '../../components/map/MapTabs';
import { addDaysToDate } from '@sat/utils/addDaysToDate';
import { useWithAndHeightObserver } from '@sat/hooks/useWithAndHeightObserver';
import MapContainer from '@sat/components/map/MapContainer';

function MapPage() {
  const session = useSession();
  const router = useRouter();
  const mapCenter = { lat: 49.246292, lng: -123.116226 };
  // Navigating to Home is not authenticated
  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router
        .push('/')
        .then(() => null)
        .catch(() => null);
    }
  }, [session, router]);

  const datesOfNextSevenDays = Array.from({ length: 7 }).map((_, i) => ({
    humanFriendlyDate: addDaysToDate(i).toLocaleString('en-us', { weekday: 'short', day: 'numeric', month: 'short' }),
    date: addDaysToDate(i),
  }));

  const [mapWidth, setMapWidth] = useState(0);
  const [mapHeight, setMapHeight] = useState(0);

  const handleResize = (width: number, height: number) => {
    setMapWidth(width);
    setMapHeight(height);
  };

  return (
    session.status === 'authenticated' && (
      <>
        <Nav position="relative" />
        <MapTabs
          tabs={datesOfNextSevenDays}
          onValueChange={(e) => {
            console.log(e);
          }}>
          <div className="grid h-full grid-cols-4">
            <div className="col-span-full"></div>

            <div className="col-span-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <CardTest key={i} />
              ))}
            </div>

            <MapContainer onResize={handleResize}>
              <Map mapCenter={mapCenter} width={mapWidth} height={mapHeight} />
            </MapContainer>
          </div>
        </MapTabs>
      </>
    )
  );
}
export default MapPage;

const CardTest = () => {
  return (
    <div className="mt-2 block rounded-lg border bg-white p-4 shadow-sm">
      <h5 className="mb-2 text-xl font-medium leading-tight text-black">Card title</h5>
      <p className="mb-4 text-base text-black">
        Some quick example text to build on the card title and make up the bulk of the card's content.
      </p>
    </div>
  );
};
