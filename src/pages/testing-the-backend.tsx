import { type NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';

import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import { RouterOutputs, api } from '@sat/utils/api';
import { Event, EventAttendee, Profile, User } from '@prisma/client';

const JustTesting: NextPage = () => {
  const { data: sessionData } = useSession();

  const getEventsCreatedByCurrentUserQuery = api.eventRouter.getEventsCreatedByCurrentUser.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  const getEventsCurrentUserIsAttendingQuery = api.eventRouter.getEventsCurrentUserIsAttending.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  const getCurrentUserWithProfileAndPastAttendedEventsQuery =
    api.userRouter.getCurrentUserWithProfileAndPastAttendedEvents.useQuery(
      undefined, // no input
      { enabled: sessionData?.user !== undefined }
    );

  if (getEventsCreatedByCurrentUserQuery.isLoading && !getEventsCreatedByCurrentUserQuery.error) {
    return <p>Loading...</p>;
  }

  if (getEventsCreatedByCurrentUserQuery.error) {
    return <p>Something went wrong: {getEventsCreatedByCurrentUserQuery.error.message}</p>;
  }

  if (getEventsCurrentUserIsAttendingQuery.isLoading && !getEventsCreatedByCurrentUserQuery.error) {
    return <p>Loading...</p>;
  }

  if (getEventsCurrentUserIsAttendingQuery.error) {
    return <p>Something went wrong: {getEventsCurrentUserIsAttendingQuery.error.message}</p>;
  }

  return (
    <>
      <h1 className="m-2 text-4xl font-bold uppercase">hello this is a test</h1>

      <h3 className="m-2 text-2xl font-bold uppercase text-blue-600">your profile</h3>

      {getCurrentUserWithProfileAndPastAttendedEventsQuery.data?.profile && (
        <div className="m-5 border-4 p-4">
          {getCurrentUserWithProfileAndPastAttendedEventsQuery.data.profile.firstName}&nbsp;
          {getCurrentUserWithProfileAndPastAttendedEventsQuery.data.profile.lastName}
          {JSON.stringify(getCurrentUserWithProfileAndPastAttendedEventsQuery.data.attendedEvents)}
        </div>
      )}

      <h3 className="m-2 text-2xl font-bold uppercase text-blue-600">your events</h3>

      {getEventsCreatedByCurrentUserQuery.data?.map((event) => (
        <div className="m-5 border-4 p-4">
          <EventTest key={event.id} event={event} />
        </div>
      ))}

      <h3 className="m-2 text-2xl font-bold uppercase text-blue-600">events you're attending</h3>

      {getEventsCurrentUserIsAttendingQuery.data?.map((event) => (
        <div className="m-5 border-4 p-4">
          <EventTest key={event.id} event={event} />
        </div>
      ))}
    </>
  );
};

export default JustTesting;

const EventTest = ({
  event,
}: {
  event: Event & {
    attendees: (EventAttendee & {
      user: User & {
        profile: Profile | null;
      };
    })[];
  };
}) => {
  console.log(event);

  return (
    <ul>
      <li>
        <p className="font-bold uppercase">title</p> {event.title}
      </li>
      <li>
        <p className="font-bold uppercase">description</p> {event.description}
      </li>
      <li>
        <p className="font-bold uppercase">latitude</p> {event.latitude}
      </li>
      <li>
        <p className="font-bold uppercase">longitude</p> {event.longitude}
      </li>
      <li>
        <p className="font-bold uppercase">date</p> {event?.date?.toLocaleDateString()}
      </li>
      <li>
        <p className="font-bold uppercase">type</p> {event.type}
      </li>
      {event?.attendees && (
        <li>
          <p className="font-bold uppercase">attendees</p>{' '}
          {event.attendees
            ?.map((attendee) => `${attendee.user.profile?.firstName} ${attendee.user.profile?.lastName}`)
            .join(', ')}
        </li>
      )}
    </ul>
  );
};
