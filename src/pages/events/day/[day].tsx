import EventsPage from '@sat/components/events/EventsPage';
import { getServerAuthSession } from '@sat/server/auth';
import { prisma } from '@sat/server/db';
import { addDaysToDate } from '@sat/utils/addDaysToDate';
import { type RouterOutputs } from '@sat/utils/api';
import { type GetServerSidePropsContext, type InferGetServerSidePropsType, type NextPage } from 'next';

const EventsByDayPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  events,
  datesOfNextSevenDays,
}) => {
  return <EventsPage events={events} datesOfNextSevenDays={datesOfNextSevenDays} />;
};

export default EventsByDayPage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    // TODO: Redirect to login page that exists
    return { redirect: { destination: '/', permanent: false } };
  }

  let day = context?.params?.day as string;

  if (!day) {
    day = new Date().toISOString().split('T')[0] as string;
  }

  const dateWithNoTimeStamp = new Date(day).toISOString().split('T')[0];

  const events = await prisma.event.findMany({
    where: { date: new Date(dateWithNoTimeStamp as string) },
    include: {
      attendees: { include: { user: { include: { profile: true } } } },
      creator: { include: { profile: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const datesOfNextSevenDays = Array.from({ length: 7 }).map((_, i) => ({
    humanFriendlyDate: addDaysToDate(i).toLocaleString('en-us', { weekday: 'short', day: 'numeric', month: 'short' }),
    date: addDaysToDate(i).toISOString().split('T')[0],
  }));

  return {
    props: {
      events: JSON.parse(JSON.stringify(events)) as RouterOutputs['eventRouter']['getEventsByDate'],
      datesOfNextSevenDays: JSON.parse(JSON.stringify(datesOfNextSevenDays)) as {
        humanFriendlyDate: string;
        date: string;
      }[],
    },
  };
};
