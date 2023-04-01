import { type Event, type EventAttendee, type Profile, type User } from '@prisma/client';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

type Props = {
  event: Event & {
    creator: User & {
      profile: Profile | null;
    };
    attendees: (EventAttendee & {
      user: User & {
        profile: Profile | null;
      };
    })[];
  };
};

const EventCard = ({ event }: Props) => {
  return (
    <Link
      href={`/events/${event.id}`}
      className="m-auto mx-2 mt-2 flex flex-col justify-center rounded-lg border bg-zinc-50 p-4 text-center shadow-sm transition hover:border-gray-200 hover:bg-zinc-100 "
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
    </Link>
  );
};

export default EventCard;
