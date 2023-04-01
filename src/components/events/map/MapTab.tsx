import Link from 'next/link';
import { useRouter } from 'next/router';

type Props = {
  tab: { humanFriendlyDate: string; date: string };
};

const activeTabBorderClasses = 'data-[state=active]:border-x-2 data-[state=active]:border-t-2';
const inactiveTabBorderClasses = 'data-[state=inactive]:border-b-2';

const MapTab = ({ tab }: Props) => {
  const router = useRouter();

  return (
    <Link
      key={tab.humanFriendlyDate}
      href={`/events/day/${tab.date}`}
      className={`${
        router.query.day === tab.date ? activeTabBorderClasses : inactiveTabBorderClasses
      } flex  h-11 flex-1 select-none flex-col items-center justify-center  bg-white  p-4 text-center text-sm leading-none shadow-sm transition hover:border-gray-200 hover:bg-zinc-100`}>
      {tab.humanFriendlyDate}
    </Link>
  );
};

export default MapTab;
