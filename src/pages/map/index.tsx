import { MarkerF, useLoadScript } from '@react-google-maps/api';
import EventDetail from '@sat/components/events/EventDetail';
import Map from '@sat/components/map';
import MapContainer from '@sat/components/map/MapContainer';
import { Nav } from '@sat/components/nav/Nav';
import { getServerAuthSession } from '@sat/server/auth';
import { addDaysToDate } from '@sat/utils/addDaysToDate';
import { api } from '@sat/utils/api';
import { type GetServerSidePropsContext, type InferGetServerSidePropsType, type NextPage } from 'next';
import { useState } from 'react';
import MapTabs from '../../components/map/MapTabs';
import Link from 'next/link';

const MapPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ session }) => {
  const mapCenter = { lat: 49.246292, lng: -123.116226 };
  const [mapWidth, setMapWidth] = useState(0);
  const [mapHeight, setMapHeight] = useState(0);

  const [activeDate, setActiveDate] = useState<Date>(new Date());

  const getEventsByDateQuery = api.eventRouter.getEventsByDate.useQuery(
    { date: activeDate },
    { enabled: session?.user !== undefined && activeDate !== null }
  );

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

  return (
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
                <Link
                  href={`/events/${event.id}`}
                  className="m-auto mx-2 mt-2 flex flex-col justify-center rounded-lg border bg-zinc-50 p-4 text-center shadow-sm transition hover:border-gray-200 hover:bg-zinc-100 "
                  key={event.id}>
                  <EventDetail event={event} />
                </Link>
              ))
            )}
            {getEventsByDateQuery.isError && <h1>error loading events</h1>}
            {getEventsByDateQuery.isSuccess && getEventsByDateQuery.data?.length === 0 && <h1>no events</h1>}
          </div>

          <MapContainer onResize={handleResize}>
            {mapIsLoaded && (
              <Map
                mapCenter={mapCenter}
                width={mapWidth}
                height={mapHeight}
                onClick={(e) => {
                  const { latLng } = e;
                  console.log(latLng);
                }}>
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
  );
};
export default MapPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
