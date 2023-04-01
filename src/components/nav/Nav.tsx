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
    <div className="z-10 bg-slate-200">
      <nav className={`flex w-screen flex-1 items-center justify-between ${position} container m-auto h-28 p-3`}>
        <Link href={'/'}>
          <div className="relative h-[100px] w-[60px] lg:w-[100px] ">
            <Image className="h-full w-full" priority src="/images/logo.svg" fill alt="Street Artist Tracker" />
          </div>
        </Link>
        <menu className="m-auto w-full max-w-[180px]">
          <ul className="flex w-full justify-between">
            {sessionData && (
              <>
                <li>
                  <NavLink className={navLinkClasses} href={'/'}>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink className={navLinkClasses} href={'/events'}>
                    Map
                  </NavLink>
                </li>
                <li>
                  <NavLink className={navLinkClasses} href={'/profile'}>
                    Profile
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </menu>
        {sessionData && (
          <AuthButton
            colour="bg-blue-700"
            hoverColour="bg-blue-600"
            signInText={'Sign in'}
            signOutText={'Sign out'}
            isArtist={false}
          />
        )}
      </nav>
    </div>
  );
};
