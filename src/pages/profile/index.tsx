import { Nav } from '@sat/components/nav/Nav';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

function profile() {
  const session = useSession();
  const router = useRouter();
  const { data: sessionData } = useSession();
  // Navigating to Home is not authenticated
  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/');
    }
  }, [session, router]);

  return (
    session.status === 'authenticated' && (
      <>
        <Nav position="relative" />
        <div className="pt-5 text-center text-2xl">This is where the profile page will go!</div>
      </>
    )
  );
}
export default profile;
