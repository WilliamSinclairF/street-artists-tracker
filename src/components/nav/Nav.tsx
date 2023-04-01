import Link from 'next/link';
import AuthButton from '../auth/AuthButton';

import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface NavProps {
  position: string;
}

export const Nav = ({ position }: NavProps) => {
  const { data: sessionData } = useSession();
  return (
    <nav className={`flex w-full items-center justify-between bg-slate-200 px-[10vw] py-2 ${position} z-10`}>
      <Link href={'/'}>
        <div className="relative h-[100px] w-[100px]">
          <Image className="h-full w-full" priority src="/images/logo.svg" fill alt="Street Artist Tracker" />
        </div>
      </Link>
      <menu className="m-auto w-full max-w-[150px]">
        <ul className="flex w-full justify-between">
          {sessionData && (
            <>
              <li>
                <Link href={'/'}>Home</Link>
              </li>
              <li>
                <Link href={'/map'}>Map</Link>
              </li>
              <li>
                <Link href={'/profile'}>Profile</Link>
              </li>
            </>
          )}
        </ul>
      </menu>
      {sessionData && (
        <AuthButton colour="bg-blue-700" hoverColour="bg-blue-600" signInText={'Sign in'} signOutText={'Sign out'} />
      )}
    </nav>
  );
};
