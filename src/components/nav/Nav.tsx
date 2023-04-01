import Link from 'next/link';
import AuthButton from '../auth/AuthButton';

import { useSession } from 'next-auth/react';
import Image from 'next/image';

export const Nav = () => {
  const { data: sessionData } = useSession();
  return (
    <nav className="flex w-full items-center justify-between bg-slate-200 px-[10vw] py-2">
      <div className='relative w-[100px] h-[100px]'>
        <Image className='w-full h-full' priority src="/images/logo.svg" fill alt="Street Artist Tracker" />
      </div>
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
      <AuthButton />
    </nav>
  );
};
