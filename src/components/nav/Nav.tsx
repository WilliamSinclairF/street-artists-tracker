import Link from 'next/link';
import AuthButton from '../auth/AuthButton';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import NavLink from './NavLink';

interface NavProps {
  position: string;
}

const navLinkClasses = 'text-md font-medium text-slate-900 hover:text-slate-700 lg:text-lg';

export const Nav = ({ position }: NavProps) => {
  const { data: sessionData } = useSession();
  return (
    <nav className={`flex w-full items-center justify-between bg-slate-200 px-[10vw] py-2 ${position} z-10 h-28`}>
      <Link href={'/'}>
        <div className="relative h-[100px] w-[100px]">
          <Image className="h-full w-full" priority src="/images/logo.svg" fill alt="Street Artist Tracker" />
        </div>
      </Link>
      <menu className="m-auto w-full max-w-[200px]">
        <ul className="flex w-full justify-between">
          {sessionData && (
            <>
              <li>
                <Link className="text-lg font-medium text-slate-900 hover:text-slate-700" href={'/'}>
                  Home
                </Link>
              </li>
              <li>
                <Link className="text-lg font-medium text-slate-900 hover:text-slate-700" href={'/events'}>
                  Events
                </Link>
              </li>
              <li>
                <Link className="text-lg font-medium text-slate-900 hover:text-slate-700" href={'/profile'}>
                  Profile
                </Link>
              </li>
            </>
          )}
        </ul>
      </menu>
      {sessionData && (
        <AuthButton colour="bg-blue-700" hoverColour="bg-blue-600" signInText={'Sign in'} signOutText={'Sign out'} isArtist={false} />
      )}
    </nav>
  );
};
