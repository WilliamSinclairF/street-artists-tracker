import { Nav } from '@sat/components/nav/Nav';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

function Profile() {
  const session = useSession();
  const router = useRouter();
  // Navigating to Home is not authenticated
  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router
        .push('/')
        .then(() => null)
        .catch(() => null);
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
export default Profile;
