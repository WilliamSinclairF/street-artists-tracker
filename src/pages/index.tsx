import { type NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';

import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  /*   START OF MAP STUFF FOR TESTING
  stuff to get the map to show up to test the google API key, feel free to move it to a separate file or do whatever with it*/
  const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    clickableIcons: true,
    scrollwheel: true,
  };

  // id rather be in vancouver
  const mapCenter = { lat: 49.246292, lng: -123.116226 };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
    libraries: ['places'],
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>Hello - Tyrell autodeploytest</h1>
      <AuthShowcase />;
      <GoogleMap
        onClick={() => void true}
        options={mapOptions}
        zoom={12}
        center={mapCenter}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: '100%', flex: 1, height: '100vh', marginTop: '1em' }}>
        <MarkerF position={mapCenter} animation={google.maps.Animation.DROP} />
      </GoogleMap>
    </>
  );

  /* END OF MAP STUFF for testing */
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-black">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}>
        {sessionData ? 'Sign out' : 'Sign in'}
      </button>
    </div>
  );
};
