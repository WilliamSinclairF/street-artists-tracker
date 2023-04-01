import Link from 'next/link';
import { useRouter } from 'next/router';

type Props = {
  tab: { humanFriendlyDate: string; date: string };
  isFirst: boolean;
};

const activeTabBorderClasses = 'border-x-2 border-t-2';
const inactiveTabBorderClasses = 'border-b-2 shadow-sm';

const MapTab = ({ tab, isFirst }: Props) => {
  const router = useRouter();
  const getClassNames = () => {
    if (!router.query?.day) {
      return isFirst ? activeTabBorderClasses : inactiveTabBorderClasses;
    } else {
      return router.query.day === tab.date ? activeTabBorderClasses : inactiveTabBorderClasses;
    }
  };

  return (
    <Link
      href={`/events/day/${tab.date}`}
      className={`${getClassNames()} flex  h-11 flex-1 select-none flex-col items-center justify-center  bg-white p-4 text-center text-sm leading-none transition hover:border-gray-200 hover:bg-zinc-100`}>
      {tab.humanFriendlyDate}
    </Link>
  );
};

export default MapTab;
