import { MarkerF, useLoadScript } from '@react-google-maps/api';
import EventDetail from '@sat/components/events/EventDetail';
import CustomizedGoogleMap from '@sat/components/events/map/CustomizedGoogleMap';
import MapContainer from '@sat/components/events/map/MapContainer';
import { type RouterOutputs } from '@sat/utils/api';
import { isWindowDefined } from '@sat/utils/isWindowDefined';
import Link from 'next/link';
import { useState } from 'react';
import { Nav } from '../nav/Nav';
import NewEventDialog from './NewEventDialog/NewEventDialog';
import MapTab from './map/MapTab';

const mapLibs: 'places'[] = ['places'];

type Props = {
  events: RouterOutputs['eventRouter']['getEventsByDate'];
  datesOfNextSevenDays: { humanFriendlyDate: string; date: string }[];
};

const EventsPage = ({ events, datesOfNextSevenDays }: Props) => {
  const mapCenter = { lat: 49.246292, lng: -123.116226 };
  const [mapWidth, setMapWidth] = useState(0);
  const [mapHeight, setMapHeight] = useState(0);
  const [openNewEventDialog, setOpenNewEventDialog] = useState(false);
  const [newPinCoords, setNewPinCoords] = useState<{ lat: number; lng: number } | null>(null);
  const { isLoaded: mapIsLoaded, loadError: mapLoadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
    libraries: mapLibs,
  });

  const handleResize = (width: number, height: number) => {
    setMapWidth(width);
    setMapHeight(height);
  };

  const handleNewEventModalClose = (status: 'save' | 'discard') => {
    console.log(status);
    setOpenNewEventDialog(false);
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    setNewPinCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  return (
    <>
      <Nav position="relative" />
      <div className="container z-50 m-auto mt-2 flex flex-col">
        <NewEventDialog open={openNewEventDialog} onClose={handleNewEventModalClose} />

        <div className="flex flex-shrink-0">
          <button onClick={() => setOpenNewEventDialog(true)}>open</button>

          {datesOfNextSevenDays.map((tab, index) => (
            <MapTab tab={tab} key={tab.humanFriendlyDate} isFirst={index === 0} />
          ))}
        </div>
        <div className="grid min-h-[50vh] grid-cols-4">
          <div className="col-span-2 max-h-[80vh] overflow-y-scroll">
            {events.map((event) => (
              <Link
                href={`/events/detail/${event.id}`}
                className="m-auto mt-2 flex flex-col justify-center rounded-md border bg-zinc-50 p-4 text-center transition hover:border-gray-200 hover:bg-zinc-100 "
                key={event.id}>
                <EventDetail event={event} />
              </Link>
            ))}
          </div>

          {mapIsLoaded && isWindowDefined() && (
            <MapContainer onResize={handleResize}>
              <CustomizedGoogleMap mapCenter={mapCenter} width={mapWidth} height={mapHeight} onClick={handleMapClick}>
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
