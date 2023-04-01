import { Nav } from '@sat/components/nav/Nav';
import { getServerAuthSession } from '@sat/server/auth';
import { prisma } from '@sat/server/db';
import { type RouterOutputs } from '@sat/utils/api';
import { type GetServerSidePropsContext, type InferGetServerSidePropsType, type NextPage } from 'next';

const EventDetailPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ event }) => (
  <>
    <Nav position="relative" />

    <h1>{event.title}</h1>
  </>
);

export default EventDetailPage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    // TODO: Redirect to login page that exists
    return { redirect: { destination: '/', permanent: false } };
  }

  const id = context?.params?.id as string;

  if (!id) {
    return { notFound: true };
  }

  const event = await prisma.event.findUniqueOrThrow({ where: { id } });

  const notFound = !event;

  return {
    props: { event: JSON.parse(JSON.stringify(event)) as RouterOutputs['eventRouter']['getEventById'], notFound },
  };
};
