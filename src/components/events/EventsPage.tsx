import { MarkerF, useLoadScript } from '@react-google-maps/api';
import EventDetail from '@sat/components/events/EventDetail';
import CustomizedGoogleMap from '@sat/components/events/map/CustomizedGoogleMap';
import MapContainer from '@sat/components/events/map/MapContainer';
import { type RouterOutputs } from '@sat/utils/api';
import { isWindowDefined } from '@sat/utils/isWindowDefined';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Nav } from '../nav/Nav';

const mapLibs: 'places'[] = ['places'];

const activeTabBorderClasses = 'border-x-2 border-t-2';
const inactiveTabBorderClasses = 'border-b-2';

type Props = {
  events: RouterOutputs['eventRouter']['getEventsByDate'];
  datesOfNextSevenDays: { humanFriendlyDate: string; date: string }[];
};

const EventsPage = ({ events, datesOfNextSevenDays }: Props) => {
  const router = useRouter();
  const mapCenter = { lat: 49.246292, lng: -123.116226 };

  const [mapWidth, setMapWidth] = useState(0);
  const [mapHeight, setMapHeight] = useState(0);

  const { isLoaded: mapIsLoaded, loadError: mapLoadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
    libraries: mapLibs,
  });

  const handleResize = (width: number, height: number) => {
    setMapWidth(width);
    setMapHeight(height);
  };

  return (
    <>
      <Nav position="relative" />
      <div className="container z-50 m-auto mt-2 flex flex-col">
        <div className="flex flex-shrink-0">
          {datesOfNextSevenDays.map((tab) => (
            <Link
              key={tab.humanFriendlyDate}
              href={`/events/day/${tab.date}`}
              className={`${
                router.query.day === tab.date ? activeTabBorderClasses : inactiveTabBorderClasses
              } flex  h-11 flex-1 select-none flex-col items-center justify-center  bg-white  p-4 text-center text-sm leading-none shadow-sm transition hover:border-gray-200 hover:bg-zinc-100`}>
              {tab.humanFriendlyDate}
            </Link>
          ))}
        </div>
        <div className="grid min-h-[50vh] grid-cols-4">
          <div className="col-span-full"></div>

          <div className="col-span-2 max-h-[80vh] overflow-y-scroll">
            {events.map((event) => (
              <Link
                href={`/events/detail/${event.id}`}
                className="m-auto mt-2 flex flex-col justify-center rounded-lg border bg-zinc-50 p-4 text-center shadow-sm transition hover:border-gray-200 hover:bg-zinc-100 "
                key={event.id}>
                <EventDetail event={event} />
              </Link>
            ))}
          </div>

          {mapIsLoaded && isWindowDefined() && (
            <MapContainer onResize={handleResize}>
              <CustomizedGoogleMap
                mapCenter={mapCenter}
                width={mapWidth}
                height={mapHeight}
                onClick={(e) => {
                  return;
                }}>
                {events.map((event) => (
                  <MarkerF
                    key={event.id}
                    position={{ lat: event.latitude, lng: event.longitude }}
                    animation={google.maps.Animation.DROP}
                  />
                ))}
              </CustomizedGoogleMap>

              {!mapIsLoaded && <h1>loading map</h1>}
              {mapLoadError && <h1>error loading map</h1>}
            </MapContainer>
          )}
        </div>
      </div>
    </>
  );
};

export default EventsPage;
