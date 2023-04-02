import { Nav } from '@sat/components/nav/Nav';
import { getServerAuthSession } from '@sat/server/auth';
import { prisma } from '@sat/server/db';
import { type RouterOutputs } from '@sat/utils/api';
import { type GetServerSidePropsContext, type InferGetServerSidePropsType, type NextPage } from 'next';
import Image from 'next/image';

const EventDetailPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ event }) => {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <Nav position="relative" />
      <main>
        <div className="content py-5 px-20 my-4 bg-slate-200 w-fit m-auto rounded-lg">
          <div className="text w-full max-w-[500px] m-auto">
          <p className='bg-slate-400 w-fit px-2 py-1 rounded-md font-semibold text-white'>{formattedDate}</p>
          <h1 className="text-5xl font-semibold text-center pt-3">{event.title}</h1>
          <p className="pt-3 text-xl text-center">{event.description}!</p>
          </div>
          <div className='m-auto mt-5 h-[500px] w-[500px] bg-[url("/images/banner-2-min.jpg")] bg-cover bg-center'></div>
        </div>
      </main>
    </>
  );
};

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
