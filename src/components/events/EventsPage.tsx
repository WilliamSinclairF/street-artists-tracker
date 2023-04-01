import { MarkerF, useLoadScript } from '@react-google-maps/api';
import EventDetail from '@sat/components/events/EventDetail';
import CustomizedGoogleMap from '@sat/components/events/map/CustomizedGoogleMap';
import MapContainer from '@sat/components/events/map/MapContainer';
import { api, type RouterOutputs } from '@sat/utils/api';
import { isWindowDefined } from '@sat/utils/isWindowDefined';
import Link from 'next/link';
import { useState } from 'react';
import { Nav } from '../nav/Nav';
import NewEventDialog from './NewEventDialog/NewEventDialog';
import MapTab from './map/MapTab';
import { useRouter } from 'next/router';
import { useUserCoords } from '@sat/hooks/useUserCoords';

const mapLibs: 'places'[] = ['places'];

type Props = {
  events: RouterOutputs['eventRouter']['getEventsByDate'];
  datesOfNextSevenDays: { humanFriendlyDate: string; date: string }[];
};

const EventsPage = ({ events, datesOfNextSevenDays }: Props) => {
  const [mapWidth, setMapWidth] = useState(0);
  const [mapHeight, setMapHeight] = useState(0);
  const [openNewEventDialog, setOpenNewEventDialog] = useState(false);
  const [newPinCoords, setNewPinCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    date: '',
    type: '',
  });

  const { currentUserCoords, error } = useUserCoords();

  const router = useRouter();
  const refreshData = () => {
    return router.replace(router.asPath);
  };

  const { isLoaded: mapIsLoaded, loadError: mapLoadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
    libraries: mapLibs,
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
    console.log(formState);
  };

  const handleResize = (width: number, height: number) => {
    setMapWidth(width);
    setMapHeight(height);
  };

  const handleNewEventModalClose = (status: 'save' | 'discard') => {
    console.log(status);
    setOpenNewEventDialog(false);

    if (status === 'save' && newPinCoords && validateForm()) {
      createEventMutation({
        title: formState.title,
        description: formState.description,
        type: formState.type,
        latitude: newPinCoords.lat,
        longitude: newPinCoords.lng,
        date: new Date(formState.date),
        time: new Date(formState.date),
      });
    }
  };

  const validateForm = () => {
    return formState.title !== '' && formState.description !== '' && formState.date !== '';
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    setNewPinCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    setOpenNewEventDialog(true);
  };

  const {
    mutate: createEventMutation,
    isLoading: createEventMutationLoading,
    isError: createEventMutationError,
  } = api.eventRouter.createEvent.useMutation({
    onError: (error) => console.log(error),
    onSuccess: (data) => {
      void refreshData();
    },
  });
  return (
    <>
      <Nav position="relative" />
      <div className="container z-50 m-auto mt-2 flex flex-col">
        <NewEventDialog
          open={openNewEventDialog}
          onClose={handleNewEventModalClose}
          formIsValid={validateForm() && !createEventMutationLoading}>
          {createEventMutationError && <div className="text-center text-red-500">Error creating event</div>}
          <div className="m-auto flex flex-col justify-center">
            <fieldset className="m-auto mt-1 flex w-full flex-col justify-center p-1">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                className="border border-zinc-300 p-1"
                value={formState.title}
                onChange={handleFormChange}
              />
            </fieldset>

            <fieldset className="m-auto mt-1 flex w-full flex-col justify-center p-1">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                name="description"
                className="border border-zinc-300 p-1"
                value={formState.description}
                onChange={handleFormChange}
              />
            </fieldset>

            <fieldset className="m-auto mt-1 flex w-full flex-col justify-center p-1">
              <label htmlFor="type">Type</label>
              <input
                type="text"
                name="type"
                className="border border-zinc-300 p-1"
                value={formState.type}
                onChange={handleFormChange}
              />
            </fieldset>

            <fieldset className="m-auto mt-1 flex w-full flex-col justify-center p-1">
              <label htmlFor="date">Date & time</label>
              <input
                type="datetime-local"
                name="date"
                className="border border-zinc-300 p-1"
                value={formState.date}
                onChange={handleFormChange}
              />
            </fieldset>
          </div>
        </NewEventDialog>

        <div className="flex flex-shrink-0">
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
              <h1 className="p-2 text-center text-lg font-medium">Click on the map to create a new event!</h1>
              <CustomizedGoogleMap
                mapCenter={currentUserCoords}
                width={mapWidth}
                height={mapHeight}
                onClick={handleMapClick}>
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
