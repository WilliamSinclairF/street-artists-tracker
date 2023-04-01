import { Nav } from '@sat/components/nav/Nav';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Map from '@sat/components/map';
import MapTabs from '../../components/map/MapTabs';
import { addDaysToDate } from '@sat/utils/addDaysToDate';
import { useWithAndHeightObserver } from '@sat/hooks/useWithAndHeightObserver';
import MapContainer from '@sat/components/map/MapContainer';
import { api } from '@sat/utils/api';
import { MarkerF, useLoadScript } from '@react-google-maps/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

function MapPage() {
  const session = useSession();
  const router = useRouter();
  const mapCenter = { lat: 49.246292, lng: -123.116226 };
  const [mapWidth, setMapWidth] = useState(0);
  const [mapHeight, setMapHeight] = useState(0);

  const [activeDate, setActiveDate] = useState<Date>(new Date());

  // Navigating to Home is not authenticated
  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router
        .push('/')
        .then(() => null)
        .catch(() => null);
    }
  }, [session, router]);

  const { isLoaded: mapIsLoaded, loadError: mapLoadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
    libraries: ['places'],
  });

  const datesOfNextSevenDays = Array.from({ length: 7 }).map((_, i) => ({
    humanFriendlyDate: addDaysToDate(i).toLocaleString('en-us', { weekday: 'short', day: 'numeric', month: 'short' }),
    date: addDaysToDate(i),
  }));

  const handleResize = (width: number, height: number) => {
    setMapWidth(width);
    setMapHeight(height);
  };

  const getEventsByDateQuery = api.eventRouter.getEventsByDate.useQuery(
    { date: activeDate }, // no input
    { enabled: session.data?.user !== undefined && activeDate !== null }
  );

  return (
    session.status === 'authenticated' && (
      <>
        <Nav position="relative" />
        <MapTabs
          tabs={datesOfNextSevenDays}
          onValueChange={(e) => {
            setActiveDate(e.date);
          }}>
          <div className="grid min-h-[50vh] grid-cols-4">
            <div className="col-span-full"></div>

            <div className="col-span-2 max-h-[80vh] overflow-y-scroll">
              {getEventsByDateQuery.isLoading ? (
                <h1>loading events</h1>
              ) : (
                getEventsByDateQuery.data?.map((event) => (
                  <div
                    className="m-auto mt-2 flex flex-col justify-center rounded-lg border bg-white p-4 text-center shadow-sm"
                    key={event.id}>
                    <h5 className="mb-2 text-xl font-medium leading-tight text-black">
                      {event.title}
                      <span className="leading-sm m-auto ml-2 inline-flex items-center rounded-full bg-orange-200 px-3 py-1 text-xs font-bold text-orange-700">
                        {event.type}
                      </span>
                    </h5>
                    <ul className="m-auto">
                      <li className="mb-4 text-base text-black">Hosted by {event.creator.name} </li>
                      <li className="mb-4 text-base text-black">{event.description} </li>
                      <li className="mb-4 text-base font-medium text-black">
                        {event.attendees?.length === 0 && 'No attendees yet. Be the first!'}
                        {event.attendees?.length > 0 &&
                          `${event.attendees?.length} attendee${event.attendees?.length > 1 ? 's' : ''}`}
                      </li>{' '}
                    </ul>

                    <button
                      className={`leading-sm m-auto inline-flex items-center rounded-full bg-blue-700 px-3 py-1 text-xs text-white no-underline transition hover:bg-blue-600`}>
                      Attend <FontAwesomeIcon icon={faCalendarCheck} className="ml-2" />
                    </button>
                  </div>
                ))
              )}
              {getEventsByDateQuery.isError && <h1>error loading events</h1>}
              {getEventsByDateQuery.isSuccess && getEventsByDateQuery.data?.length === 0 && <h1>no events</h1>}
            </div>

            <MapContainer onResize={handleResize}>
              {mapIsLoaded && (
                <Map mapCenter={mapCenter} width={mapWidth} height={mapHeight}>
                  {getEventsByDateQuery.data?.map((event) => (
                    <MarkerF
                      key={event.id}
                      position={{ lat: event.latitude, lng: event.longitude }}
                      animation={google.maps.Animation.DROP}
                    />
                  ))}
                </Map>
              )}
              {!mapIsLoaded && <h1>loading map</h1>}
              {mapLoadError && <h1>error loading map</h1>}
            </MapContainer>
          </div>
        </MapTabs>
      </>
    )
  );
}
export default MapPage;
